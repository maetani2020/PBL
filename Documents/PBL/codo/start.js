document.addEventListener('DOMContentLoaded', () => {
  const mainTitle = document.getElementById('mainTitle');
  const container = document.getElementById('mainContainer');

  const rareMessages = [
    "橋本社長考案！カスタマーマスター",
    "駿之介監督絶賛！カスタマーマスター",
    "前谷プロが作りました👍カスタマーマスター",
    "カスタマーYOUKOUマスター"
  ];

  const isRare = Math.random() < 0.05; // 5%

  if (isRare) {
    const message = rareMessages[Math.floor(Math.random() * rareMessages.length)];
    mainTitle.textContent = message;
    mainTitle.classList.add('rare-title');
    container.classList.remove('normal-background');
    container.classList.add('rare-background');
    console.log("🎉 レア演出が表示されました！");
  }

  document.getElementById('startClaimButton').addEventListener('click', () => {
    console.log('「クレーム対応開始！」が選択されました。');
  });

  document.getElementById('customerSettingsButton').addEventListener('click', () => {
    console.log('「カスタマー設定」が選択されました。');
    // window.location.href = 'customer_settings.html'; // 必要に応じて遷移
  });
});