// ランダムメッセージ一覧
const messages = [
    "完璧な対応だ！",
    "素晴らしい対応だ！",
    "君は天才だ！",
    "やるやん",
    "君、この仕事に就かないか？",
    "やばすぎだろ、神かよ"
];

// メッセージ表示用のh1要素を取得
const messageElement = document.getElementById('randomMessage');

// ランダムに1つ選んで表示
const randomIndex = Math.floor(Math.random() * messages.length);
messageElement.textContent = messages[randomIndex];