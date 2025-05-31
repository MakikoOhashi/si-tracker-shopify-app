import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { si_number, type, url } = req.body;
  if (!si_number || !type || !url) {
    return res.status(400).json({ error: 'missing fields' });
  }

  // パスは `${si_number}/${type}.拡張子` 形式前提
  const matches = url.match(/\/([^/]+)\.([a-zA-Z0-9]+)$/);
  let filePath = '';
  if (matches) {
    filePath = `${si_number}/${type}.${matches[2]}`;
  } else {
    return res.status(400).json({ error: 'ファイルパス特定失敗' });
  }

  const { error } = await supabase
    .storage
    .from('shipment-files')
    .remove([filePath]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ ok: true });
}