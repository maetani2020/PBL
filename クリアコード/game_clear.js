document.addEventListener('DOMContentLoaded', () => {
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
    const rareProbability = 0.005; // 0.5%の確率

    const messageElement = document.getElementById('randomMessage');

    if (Math.random() < rareProbability) {
        messageElement.textContent = rareMessage;
        messageElement.classList.add('rare-message');
    } else {
        const randomIndex = Math.floor(Math.random() * messages.length);
        messageElement.textContent = messages[randomIndex];
        messageElement.classList.remove('rare-message');
    }

    document.getElementById('differentPatternButton').addEventListener('click', () => {
        console.log('「難易度を変更」が選択されました。');
        window.location.href = "Level.html";
    });

    document.getElementById('homeButton').addEventListener('click', () => {
        console.log('「タイトルに戻る」が選択されました。');
        window.location.href = "start.html";
    });
});
