// pages/api/createShipment.js
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // サーバーサイドではSERVICE_ROLE_KEYを使用

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);


export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📦 受信データ:', req.body);

    const { 
      si_number, 
      supplier_name, 
      transport_type, 
      items, 
      //ocr_text,
      status,
      etd,
      eta,
      delayed,
      clearance_date,
      arrival_date,
      memo,
      shop_id, 
      is_archived
    } = req.body.shipment; // Modal.jsxと同じ形式でデータを受け取る

    // バリデーション
    if (!si_number || !supplier_name) {
      return res.status(400).json({ error: 'SI番号と仕入先は必須項目です' });
    }

    // メインデータをshipmentsテーブルに保存（Modal.jsxと同じテーブル構造）
    const { data: shipmentData, error: shipmentError } = await supabase
      .from('shipments') // Modal.jsxと同じテーブル名
      .insert([
        {
          si_number,
          supplier_name,
          transport_type,
          items,  // ← JSONBカラムにそのまま保存
          //ocr_text,
          status: status || "SI発行済",
          etd,
          eta,
          delayed: delayed || false,
          clearance_date,
          arrival_date,
          memo,
          is_archived: is_archived || false,
          shop_id, 
          //created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (shipmentError) {
      console.error('❌ Shipment insert error:', shipmentError);
      console.error('❌ Error details:', {
        message: shipmentError.message,
        details: shipmentError.details,
        hint: shipmentError.hint,
        code: shipmentError.code
      });
      return res.status(500).json({ 
        error: 'データの保存に失敗しました',
        details: shipmentError.message,
        hint: shipmentError.hint
      });
    }

    console.log('✅ 保存成功:', shipmentData);

    // 成功レスポンス
    res.status(200).json({ 
      id: shipmentData.id, 
      message: 'データが正常に保存されました',
      data: shipmentData
    });

  } catch (error) {
    console.error('❌ Unexpected error in createShipment:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'サーバーエラーが発生しました',
      details: error.message 
    });
  }
}