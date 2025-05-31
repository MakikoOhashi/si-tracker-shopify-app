//pages/api/ai-parse.js

import { generateGeminiContent } from "../../lib/geminiClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const { text, fields } = req.body;
  if (!text) {
    res.status(400).json({ error: "Missing text" });
    return;
  }
   // 未入力項目だけリストアップ
   const missing = Object.entries(fields).filter(([_, v]) => {
    // 配列の場合は空配列かどうかチェック
    if (Array.isArray(v)) return v.length === 0;
    // 文字列の場合は空文字かどうかチェック
    return !v || v.trim() === "";
  }).map(([k]) => k);

  if(missing.length === 0) {
    res.status(200).json({ result: "{}" });
    return;
  }
  
    // AIへのプロンプト設計
    const prompt = `
      次のShipping Documentsテキストから、以下の項目を推測し、各項目名・形式は必ず下記の通り返してください。
      あなたは請求書・船積書類のOCRテキストから情報を抽出するAIです。

      【必ず守るルール】
      - 回答は**JSONオブジェクトのみ**で返してください。自然言語、解説文、余計な出力は禁止です。
      - **絶対に下記のフィールド名・形式のみで返してください**。項目名・配列名・型は変更禁止です。

      不足項目: ${missing.join(", ")}

      【出力するフィールド】
      - si_number（文字列）
      - supplier_name（文字列）
      - transport_type（文字列）
      - items（配列。要素は下記4つのプロパティを持つオブジェクト）
          - name（文字列、商品名または商品説明）
          - quantity（数字だけ。単位やカンマ、空白はいらない）
          - product_code（文字列。なければ空文字でOK）
          - unit_price（文字列。なければ空文字でOK）

      既に判明している項目:
      ${Object.entries(fields).filter(([_, v]) => {
        if (Array.isArray(v)) return v.length > 0;
        return v && v.trim() !== "";
      }).map(([k,v]) => `- ${k}: ${Array.isArray(v) ? `[${v.length}件の商品]` : v}`).join("\n")}
      
      原文:
      ${text}

      返答例:
      {
        "si_number": "SN13/10-0005",
        "supplier_name": "SUNPLAN SOFT CO., LTD",
        "transport_type": "NIPPON MARU",
        "items": [
          {"name": "LED1102B Chip LED Blue", "quantity": "10000"},
          {"name": "LED1102G Chip LED Green", "quantity": "10000"},
          {"name": "LED953S Chip LED SET", "quantity": "1000"}
        ]
      }
      `;
    
  
    try {
      const aiText = await generateGeminiContent(prompt);
      console.log("AI Response:", aiText); // デバッグ用

          // JSONの抽出を試行
       let cleanedJson = aiText;

          // ```json ブロックがある場合は抽出
    const jsonMatch = aiText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[1];
    }
    
    // JSONの妥当性をチェック
    try {
      JSON.parse(cleanedJson);
      res.status(200).json({ result: cleanedJson });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw AI text:", aiText);
      res.status(200).json({ result: "{}" }); // エラー時は空オブジェクト
    }
    } catch (e) {
      console.error("AI API Error:", e);
      res.status(500).json({ error: e.message || String(e) });
    }
  }