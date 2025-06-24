document.addEventListener('DOMContentLoaded', () => {
    const messages = [
        "お客様を怒らせてしまった...",
        "対応を間違えてしまった...",
        "失敗は成功の基、リベンジするかい？",
        "店長「給料下げとくね」",
        "事態が悪化してしまった...",
        "店の評価が☆１になってしまった...",
        "「プレイヤー、謝罪しろ」",
        "何がいけなかったのだろうか...？",
        "０点だ、次！",
        "(めんどくさいお客さんだぜ...)"
    ];

    const rareMessage = "橋本社長も大慌て！";
    const rareProbability = 0.005; // 0.5%

    const messageElement = document.getElementById('randomMessage');

    const isRare = Math.random() < rareProbability;
    let selectedMessage;

    if (isRare) {
        selectedMessage = rareMessage;
        messageElement.classList.add('rare-message');
    } else {
        const randomIndex = Math.floor(Math.random() * messages.length);
        selectedMessage = messages[randomIndex];
        messageElement.classList.remove('rare-message');
    }

    messageElement.textContent = selectedMessage;

    // 各ボタンのイベント処理
    document.getElementById('doAgainButton').addEventListener('click', () => {
        console.log('「もう一度やる」が選択されました。');
        // 必要であればここに遷移や処理を追加
    });

    document.getElementById('differentPatternButton').addEventListener('click', () => {
        console.log('「難易度を変更」が選択されました。');
        window.location.href = "difficulty_settings.html"; // ファイル名を修正しました
    });

    document.getElementById('homeButton').addEventListener('click', () => {
        console.log('「タイトルに戻る」が選択されました。');
        window.location.href = "start.html";
    });
});