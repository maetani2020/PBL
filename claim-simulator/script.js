const chatArea = document.querySelector('.chat-area');
const playerInputElement = document.getElementById('player-input');
const sendButton = document.getElementById('send-button');
const startButton = document.getElementById('start-button');
const backendStatusDiv = document.getElementById('backend-status');

// バックエンドAPIのエンドポイントURL
const BACKEND_URL = 'http://localhost:3000';

let conversationHistory = []; //Gemini会話履歴を保持
let gameInProgress = false;

/**
 * チャットエリアにメッセージを追加
 * @param {string} text 表示するテキスト
 * @param {string} sender 'ai', 'player', 'system'
 */
function addMessageToChat(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    const senderPrefix = sender === 'ai' ? 'AI' : (sender === 'player' ? 'あなた' : '');
    messageDiv.innerHTML = senderPrefix ? `<strong>${senderPrefix}:</strong> ${text}` : text;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight; // 最新メッセージへスクロール
}

/**
 * バックエンドサーバーの動作確認
 */
async function checkBackendStatus() {
    try {
        const response = await fetch(`${BACKEND_URL}/`); // バックエンドのルートにアクセス
        if (response.ok) {
            const text = await response.text();
            backendStatusDiv.textContent = `バックエンド接続OK: ${text}`;
            backendStatusDiv.className = 'api-key-info success'; // クラス名変更
        } else {
            throw new Error(`接続失敗: ${response.status}`);
        }
    } catch (error) {
        console.error("バックエンド接続エラー:", error);
        backendStatusDiv.textContent = `バックエンド接続エラー: ${error.message} (サーバーを起動していますか？)`;
        backendStatusDiv.className = 'api-key-info error'; // クラス名変更
        // ゲーム開始ボタンなどを無効化する処理もここに追加可能
        startButton.disabled = true;
    }
}


/**
 * ゲーム開始 / 次のクレーム処理
 */
async function startGame() {
    gameInProgress = true;
    conversationHistory = [];
    chatArea.innerHTML = ''; // チャットクリア
    addMessageToChat('AIが最初のクレームを考えています...', 'system');

    playerInputElement.disabled = true;
    sendButton.disabled = true;
    startButton.disabled = true;

    try {
        const response = await fetch(`${BACKEND_URL}/api/initiate-claim`, {
            method: 'POST',
            // headers: { 'Content-Type': 'application/json' }, // POSTでボディがなければ不要な場合も
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `サーバーエラー: ${response.status}`);
        }

        const data = await response.json();
        const initialClaim = data.claim;

        // システムメッセージ（生成中）を削除
        if (chatArea.lastChild && chatArea.lastChild.classList.contains('system-message')) {
            chatArea.removeChild(chatArea.lastChild);
        }
        addMessageToChat(initialClaim, 'ai');

        // Gemini APIの会話履歴形式で初期化
        // バックエンドでプロンプトを工夫する場合、ここでのuserロールのプロンプトは不要かもしれない
        conversationHistory.push({ role: "user", parts: [{ text: "あなたは非常に気難しい飲食店の顧客です。次の発言からクレームを開始してください。" }] }); // AIの役割設定を履歴の最初に入れる
        conversationHistory.push({ role: "model", parts: [{ text: initialClaim }] });


        playerInputElement.disabled = false;
        sendButton.disabled = false;
        startButton.textContent = "次のクレームへ"; // ボタンのテキスト変更
        playerInputElement.focus();

    } catch (error) {
        console.error("クレーム取得エラー:", error);
        if (chatArea.lastChild && chatArea.lastChild.classList.contains('system-message')) {
            chatArea.removeChild(chatArea.lastChild);
        }
        addMessageToChat(`クレームの取得に失敗しました: ${error.message}`, 'system');
        gameInProgress = false;
    } finally {
        startButton.disabled = false;
    }
}

/**
 * プレイヤーの応答を送信し、AIの反応を取得
 */
async function handlePlayerResponse() {
    if (!gameInProgress) {
        addMessageToChat('まず「ゲーム開始」ボタンを押してください。', 'system');
        return;
    }
    const playerText = playerInputElement.value.trim();
    if (!playerText) return;

    addMessageToChat(playerText, 'player');
    conversationHistory.push({ role: "user", parts: [{ text: playerText }] });

    playerInputElement.value = ''; // 入力欄をクリア
    playerInputElement.disabled = true;
    sendButton.disabled = true;
    const thinkingMessage = addMessageToChat("AIが応答を考えています...", "system");

    try {
        const response = await fetch(`${BACKEND_URL}/api/handle-response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationHistory: conversationHistory.slice(0, -1),
                playerMessage: playerText
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `サーバーエラー: ${response.status}`);
        }

        const data = await response.json();
        const aiResponseText = data.response;

        if (chatArea.lastChild && chatArea.lastChild.classList.contains('system-message')) {
            chatArea.removeChild(chatArea.lastChild); // "考えています..."メッセージを削除
        }
        addMessageToChat(aiResponseText, 'ai');
        conversationHistory.push({ role: "model", parts: [{ text: aiResponseText }] });

        // 簡単な終了判定（例: AIが感謝の言葉や納得の言葉を述べたら）
        const lowerResponse = aiResponseText.toLowerCase();
        if (["ありがとう", "結構です", "わかりました", "納得しました", "それでいいです"].some(phrase => lowerResponse.includes(phrase))) {
            addMessageToChat("クレーマーは納得したようです！対応完了！", "system");
            gameInProgress = false;
            startButton.textContent = "次のクレームへ";
        }


    } catch (error) {
        console.error("AI応答取得エラー:", error);
        if (chatArea.lastChild && chatArea.lastChild.classList.contains('system-message')) {
            chatArea.removeChild(chatArea.lastChild);
        }
        addMessageToChat(`AI応答の取得に失敗しました: ${error.message}`, 'system');
    } finally {
        playerInputElement.disabled = false;
        sendButton.disabled = false;
        if (gameInProgress) {
            playerInputElement.focus();
        }
    }
}

// イベントリスナーの設定
startButton.addEventListener('click', startGame);
sendButton.addEventListener('click', handlePlayerResponse);
playerInputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !sendButton.disabled) {
        handlePlayerResponse();
    }
});

// ページ読み込み時にバックエンドのステータスを確認
document.addEventListener('DOMContentLoaded', () => {
    checkBackendStatus();
    addMessageToChat('「ゲーム開始 / 次のクレーム」ボタンを押してクレーム対応を開始してください。', 'system');
});