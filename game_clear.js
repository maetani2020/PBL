document.addEventListener('DOMContentLoaded', () => {
    // 🌟 ランダムメッセージの表示処理 (game_clear.jsのロジックを採用)
    const messages = [
        "完璧な対応ではないか！",
        "素晴らしい.....いい対応だ",
        "君...天才って呼ばれてる？",
        "ふーん.....やるやん",
        "店の評価が☆５になったぜ！",
        "あなたがカスタマーの神ですか？",
        "悪くない、プラス５点",
        "店長「給料あげとくね」",
        "「恐ろしく丁寧な対応。俺でなきゃ驚いてたね」",
        "（ふっ、我ながら完璧な対応力だ)"
    ];

    const rareMessage = "橋本社長も大喜び！";
    const rareProbability = 0.005; // 0.5%の確率でレアメッセージが出現するよ

    const messageElement = document.getElementById('randomMessage');

    // 確率でレアメッセージを表示するか、通常のメッセージを表示するか決めるよ
    if (Math.random() < rareProbability) {
        messageElement.textContent = rareMessage;
        messageElement.classList.add('rare-message');
    } else {
        const randomIndex = Math.floor(Math.random() * messages.length);
        messageElement.textContent = messages[randomIndex];
        messageElement.classList.remove('rare-message'); // 通常メッセージの場合はレアスタイルを削除
    }

    // 🎮 ボタン処理
    const changeDifficultyButton = document.getElementById('changeDifficultyButton');
    const homeButton = document.getElementById('homeButton');

    changeDifficultyButton.addEventListener('click', () => {
        console.log('「難易度を変える」が選択されました。');
        window.location.href = "difficulty_settings.html"; // ファイル名を修正しました
    });

    homeButton.addEventListener('click', () => {
        console.log('「タイトルに戻る」が選択されました。');
        window.location.href = "start.html";
    });
});