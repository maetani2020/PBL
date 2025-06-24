// server.js (和解可能なAIへの修正版)

require('dotenv').config();

// 2. 必要なモジュールをまとめて読み込む
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Gemini API SDK
const cors = require('cors'); // CORSミドルウェア

// 3. Expressアプリケーションを作成
const app = express();

// 4. ポート番号を設定
const PORT = 3000;

// 5. 環境変数からAPIキーを取得
const apiKey = process.env.GEMINI_API_KEY;

// 6. APIキーが設定されているか確認
if (!apiKey) {
    console.error('エラー: GEMINI_API_KEY が .env ファイルに設定されていません。');
    process.exit(1); // APIキーがない場合はサーバーを起動せず終了
}

// 7. Gemini APIクライアントを初期化
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // 使用するモデルを指定

// 8. ミドルウェアを設定
app.use(cors());
app.use(express.json());

// 9. ルートURL ("/") にGETリクエストがあった場合の基本的な処理
app.get('/', (req, res) => {
  res.send('バックエンドサーバーへようこそ！Gemini APIの準備ができました。');
});

// 10. 指定したポート番号でサーバーを起動し、リクエストを待ち受ける
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました。 http://localhost:${PORT}/ でアクセスできます。`);
});

// POSTリクエストで /api/initiate-claim にアクセスがあった場合の処理
app.post('/api/initiate-claim', async (req, res) => {
  try {
    const claimGenres = [
        "レストランで注文した料理",
        "購入したばかりの最新スマートフォン",
        "オンラインで注文した服のサイズ",
        "スーパーで購入した食品の品質",
        "公共交通機関の遅延",
        "新しく契約したインターネット回線の速度",
        "ソフトウェアのアップデート後の不具合",
        "Webサイトの会員登録プロセスの複雑さ"
    ];
    const randomGenre = claimGenres[Math.floor(Math.random() * claimGenres.length)];
    const prompt = `あなたは、とある店の非常に気難しい顧客です。
これから「${randomGenre}」について、何か一つ不満を見つけてください。
その不満を、少しイライラした口調で、かつ具体的に店員に伝えてください。
ただし、まだ激昂はしておらず、冷静さを少し保っています。
必ず日本語で、1～2文で簡潔に回答してください。`;
    
    const generationConfig = {
      temperature: 0.8,
    };

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: generationConfig,
    });
    
    const response = await result.response;
    const claimText = response.text();

    res.json({ claim: claimText });
  } catch (error) {
    console.error("Gemini API (initiate-claim) エラー:", error);
    res.status(500).json({ error: "AIによるクレーム生成に失敗しました。" });
  }
});

// POSTリクエストで /api/handle-response にアクセスがあった場合の処理
app.post('/api/handle-response', async (req, res) => {
  const { conversationHistory, playerMessage } = req.body;

  if (!conversationHistory || typeof playerMessage === 'undefined') {
    return res.status(400).json({ error: "会話履歴またはプレイヤーの発言が不足しています。" });
  }

  try {
    // ★★★ AIの役割と行動指針 ★★★
    const systemInstruction = {
      role: "user",
      parts: [{ text: `あなたは不満を抱えている気難しい顧客です。これはゲームのシミュレーションです。絶対に顧客の役割を演じきってください。
    
      あなたの行動指針は以下の通りです。
      1. 基本的には、プレイヤー（店員）の応答に対して、疑い深く、そっけない、あるいはさらに不満を表明する形で応答してください。「了解しました」「承知いたしました」のような丁寧な言葉遣いは絶対に禁止です。
      2. **しかし、もしプレイヤーが具体的な解決策（例：「新しいものと交換します」「すぐに返金手続きをします」）や、共感のこもった真摯な謝罪を提示した場合は、あなたの態度を少し軟化させてください。** 例えば、「…本当でしょうね？」「それで、具体的にどうしてくれるんですか？」のように、少しだけ歩み寄る姿勢を見せてください。
      3. **そして、プレイヤーが納得のいく対応を続けた結果、あなたが満足した場合は、「分かりました。今回はそれで結構です」や「では、それでお願いします」のように、明確に和解する言葉を述べて会話を終了させてください。**
      
      プレイヤーの的外れな返答（例：「おけ」、「ばか」）には、さらに怒るか、呆れたような態度で応答してください。` }]
    };

    // ユーザーからの会話履歴にシステム指示を追加する
    const fullPromptContents = [
      systemInstruction,
      ...conversationHistory,
      { role: "user", parts: [{ text: playerMessage }] }
    ];
    
    const generationConfig = {
      temperature: 0.7, // 会話の応答では少し安定させる
    };

    const result = await model.generateContent({
      contents: fullPromptContents,
      generationConfig: generationConfig
    });
    
    const response = await result.response;
    const aiResponseText = response.text();

    res.json({ response: aiResponseText });
  } catch (error) {
    console.error("Gemini API (handle-response) エラー:", error);
    res.status(500).json({ error: "AIによる応答生成に失敗しました。" });
  }
});


// 【追加】POSTリクエストで /api/get-hint にアクセスがあった場合の処理
app.post('/api/get-hint', async (req, res) => {
    const { conversationHistory, complaint } = req.body;
  
    if (!conversationHistory || !complaint) {
      return res.status(400).json({ error: "会話履歴またはクレーム内容が不足しています。" });
    }
  
    try {
        // ヒント生成用のプロンプト
        const hintPrompt = {
            role: "user",
            parts: [{ text: `これはクレーム対応ゲームです。現在のクレームは「${complaint}」です。
以下の会話履歴を踏まえて、プレイヤーが次にとるべき対応の方向性や考え方について、具体的なセリフではなく、簡潔なヒントを与えてください。
例：「共感を示し、具体的な解決策を提案する」「丁寧な言葉遣いで、事実確認を行う」` }]
        };
        
        const result = await model.generateContent({
            contents: [...conversationHistory, hintPrompt]
        });
      
        const response = await result.response;
        const hintText = response.text();
  
        res.json({ hint: hintText });
  
    } catch (error) {
        console.error("Gemini API (get-hint) エラー:", error);
        res.status(500).json({ error: "AIによるヒント生成に失敗しました。" });
    }
});