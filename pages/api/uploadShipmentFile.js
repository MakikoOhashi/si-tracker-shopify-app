import formidable from 'formidable';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parse error' });

    const { si_number, type } = fields;
    const file = files.file;
    if (!si_number || !type || !file) {
      return res.status(400).json({ error: 'missing fields' });
    }

    const fileExt = file.originalFilename.split('.').pop();
    const filePath = `${si_number}/${type}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('shipment-files')
      .upload(filePath, file.filepath, { upsert: true });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { data } = supabase.storage
      .from('shipment-files')
      .getPublicUrl(filePath);

    return res.status(200).json({ publicUrl: data.publicUrl });
  });
}