// menu-handler.js

window.backToMenu = function () {
    clearInterval(timerInterval);

    const mainMenu = document.querySelector('[menu-handler]');
    mainMenu.setAttribute('visible', true);
    mainMenu.setAttribute('pointer-events', 'auto');

    const ingameMenu = document.querySelector('#ingameMenu');
    ingameMenu.setAttribute('visible', false);

    const cameraRig = document.querySelector('#cameraRig');
    cameraRig.setAttribute('position', '0 1 -6');
    cameraRig.setAttribute('rotation', '0 180 0');

    const gameManager = document.querySelector('[game-manager]');
    while (gameManager.firstChild) {
        gameManager.removeChild(gameManager.firstChild);
    }
}

window.exitGame = function () {
    clearInterval(timerInterval);

    const sceneEl = document.querySelector('a-scene');
    if (sceneEl.is('vr-mode') || sceneEl.is('ar-mode')) {
        sceneEl.exitVR();
        window.close();
    }
}

window.showLeaderboard = function () {
    const mainMenu = document.querySelector('[menu-handler]');
    mainMenu.setAttribute('visible', false);
    mainMenu.setAttribute('pointer-events', 'none');

    const leaderboardMenu = document.querySelector('#leaderboardMenu');
    leaderboardMenu.setAttribute('visible', true);
    leaderboardMenu.setAttribute('pointer-events', 'auto');
};

window.hideLeaderboard = function () {
    console.log("test");
    const leaderboardMenu = document.querySelector('#leaderboardMenu');
    leaderboardMenu.setAttribute('visible', false);
    leaderboardMenu.setAttribute('pointer-events', 'none');

    backToMenu();
};