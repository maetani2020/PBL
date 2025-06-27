document.addEventListener('DOMContentLoaded', () => {
    const normalModeButton = document.getElementById('normalMode');
    const hardModeButton = document.getElementById('hardMode');
    const crazyModeButton = document.getElementById('crazyMode');
    const backButton = document.getElementById('backButton');

    // 難易度ボタンがクリックされた時の処理だよ
    const selectDifficulty = (button, difficultyName) => {
        // まず全てのボタンから 'selected' クラスを削除するよ
        [normalModeButton, hardModeButton, crazyModeButton].forEach(btn => {
            btn.classList.remove('selected');
        });
        // クリックされたボタンに 'selected' クラスを追加するよ
        button.classList.add('selected');

        // 選択された難易度をコンソールに表示するよ（実際にはここでゲームの難易度を設定する処理を入れるよ）
        console.log(`${difficultyName} が選択されました。`);
    };

    // 各ボタンにクリックイベントリスナーを追加するよ
    normalModeButton.addEventListener('click', () => selectDifficulty(normalModeButton, 'ノーマルモード'));
    hardModeButton.addEventListener('click', () => selectDifficulty(hardModeButton, 'ハードモード'));
    crazyModeButton.addEventListener('click', () => selectDifficulty(crazyModeButton, 'クレイジーモード'));

    // 戻るボタンがクリックされた時の処理だよ
    backButton.addEventListener('click', () => {
        console.log('戻るボタンがクリックされました。');
        alertMessage('前の画面に戻ります。', 'info'); // カスタムアラートを表示
    });

    // カスタムアラートメッセージを表示する関数だよ
    function alertMessage(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50`;
        if (type === 'info') {
            alertBox.classList.add('bg-blue-500');
        } else if (type === 'success') {
            alertBox.classList.add('bg-green-500');
        } else if (type === 'error') {
            alertBox.classList.add('bg-red-500');
        }
        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.remove();
        }, 3000); // 3秒後にアラートを消すよ
    }
});