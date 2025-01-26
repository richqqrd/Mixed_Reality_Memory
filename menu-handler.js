AFRAME.registerComponent('menu-handler', {
    init: function () {
        // Init code here if needed
    },

    startGame: function () {
        console.log('Starting game');
        const gameManager = document.querySelector('[game-manager]').components['game-manager'];
        // TODO: Add start game logic
    },

    resetGame: function () {
        console.log('Resetting game');
        const gameManager = document.querySelector('[game-manager]').components['game-manager'];
        // TODO: Add reset game logic
    },

    exitGame: function () {
        console.log("Exiting game...");
        const scene = document.querySelector('a-scene');

        // Abschiedsbildschirm anzeigen
        const exitText = document.createElement('a-text');
        exitText.setAttribute('value', 'Thank you for playing!');
        exitText.setAttribute('position', '0 2 -3');
        exitText.setAttribute('color', '#FF0000');
        exitText.setAttribute('align', 'center');
        scene.appendChild(exitText);

        // Überprüfen, ob eine WebXR-Session aktiv ist
        const xrSession = scene.renderer.xr.getSession();
        if (xrSession) {
            // Prüfen, ob es sich um AR oder VR handelt
            if (xrSession.environmentBlendMode === "opaque") {
                console.log("VR session ending...");
            } else if (xrSession.environmentBlendMode === "alpha-blend") {
                console.log("AR session ending...");
            }
            xrSession.end(); // WebXR-Sitzung beenden
        }
    }
});