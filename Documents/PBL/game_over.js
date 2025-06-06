const messages = [
    "お客様を怒らせてしまった...",
    "対応を間違えてしまったかも...",
    "お客様、めちゃくちゃ怒ってる...",
    "店長「お前、クビだ」",
    "事態が悪化してしまった...",
    "店の評価が☆１になってしまった..."
];

const messageElement = document.getElementById('randomMessage');
const randomIndex = Math.floor(Math.random() * messages.length);
messageElement.textContent = messages[randomIndex];