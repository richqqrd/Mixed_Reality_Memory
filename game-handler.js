AFRAME.registerComponent('game-manager', {
    init: function () {
        // Available card textures
        this.cardTypes = [
            '#club2', '#club3', '#club4', '#club5', '#club6',
            '#club7', '#club8', '#club9', '#club10',
            '#clubJ', '#clubQ', '#clubK', '#clubA',
            '#heart2', '#heart3', '#heart4', '#heart5', '#heart6',
            '#heart7', '#heart8', '#heart9', '#heart10',
            '#heartJ', '#heartQ', '#heartK', '#heartA',
            '#diamond2', '#diamond3', '#diamond4', '#diamond5', '#diamond6',
            '#diamond7', '#diamond8', '#diamond9', '#diamond10',
            '#diamondJ', '#diamondQ', '#diamondK', '#diamondA',
            '#spade2', '#spade3', '#spade4', '#spade5', '#spade6',
            '#spade7', '#spade8', '#spade9', '#spade10',
            '#spadeJ', '#spadeQ', '#spadeK', '#spadeA'
        ];
    },

    selectRandomCards: function (count) {
        const shuffledTypes = this.shuffleArray([...this.cardTypes]);
        return shuffledTypes.slice(0, count);
    },

    startNewGame: function () {
        const scene = document.querySelector('a-scene');
        const isAR = scene.is('ar-mode');

        // Clear existing cards
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }

        // Karten direkt für AR oder VR/Desktop platzieren
        const startPosition = isAR ? { x: -0.4, z: -0.4 } : { x: -0.1, z: 0 }; // Adjust VR start position here
        const spacing = isAR ? 0.15 : 0.4; // Kleinere Abstände in AR
        const size = isAR ? { width: 0.06, height: 0.09 } : { width: 0.15, height: 0.25 }; this.createCardsGrid(startPosition, spacing, size);
    },

    createCardsGrid: function (startPosition, spacing, size) {
        const selectedCards = this.selectRandomCards(8);
        let cards = [];
        selectedCards.forEach(card => {
            cards.push(card, card); // Create pairs
        });
        cards = this.shuffleArray(cards);

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cardIndex = row * 4 + col;
                if (cardIndex < cards.length) {
                    this.createCard(
                        startPosition.x + col * spacing,
                        startPosition.z + row * spacing,
                        cards[cardIndex],
                        size
                    );
                }
            }
        }
    },

    shuffleArray: function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    createCard: function (x, z, cardType, size) {
        const card = document.createElement('a-box');
        card.setAttribute('position', `${x} 0.01 ${z}`);
        card.setAttribute('rotation', '-90 0 0');
        card.setAttribute('depth', '0.001');
        card.setAttribute('height', size.height); // Einheitliche Größe
        card.setAttribute('width', size.width);
        card.setAttribute('material', 'src: #card-back; side: double');
        card.setAttribute('data-card', cardType);
        card.setAttribute('card-handler', '');
        card.setAttribute('class', 'card');

        this.el.appendChild(card);
    }
});

AFRAME.registerComponent('card-handler', {
    init: function () {
        this.isFlipped = false;

        if (!AFRAME.cardState) {
            AFRAME.cardState = {
                firstCard: null,
                secondCard: null,
                canFlip: true
            };
        }

        this.el.addEventListener('click', this.onCardSelect.bind(this)); // Für VR/Desktop
        this.el.addEventListener('touchstart', this.onCardSelect.bind(this)); // Für AR
    },

    onCardSelect: function () {
        if (!AFRAME.cardState.canFlip) return;
        if (this.isFlipped) return;

        const cardType = this.el.getAttribute('data-card');

        if (!AFRAME.cardState.firstCard) {
            AFRAME.cardState.firstCard = this.el;
            this.isFlipped = true;
            this.el.setAttribute('material', `src: ${cardType}; side: double`);
        } else if (!AFRAME.cardState.secondCard && this.el !== AFRAME.cardState.firstCard) {
            AFRAME.cardState.secondCard = this.el;
            this.isFlipped = true;
            this.el.setAttribute('material', `src: ${cardType}; side: double`);

            const firstCardType = AFRAME.cardState.firstCard.getAttribute('data-card');
            AFRAME.cardState.canFlip = false;

            if (firstCardType === cardType) {
                window.pairsFound++;
                if (typeof window.updatePairsFound === 'function') {
                    window.updatePairsFound();
                }

                AFRAME.cardState.firstCard = null;
                AFRAME.cardState.secondCard = null;
                AFRAME.cardState.canFlip = true;
            } else {
                setTimeout(() => {
                    AFRAME.cardState.firstCard.setAttribute('material', 'src: #card-back; side: double');
                    AFRAME.cardState.secondCard.setAttribute('material', 'src: #card-back; side: double');
                    AFRAME.cardState.firstCard.components['card-handler'].isFlipped = false;
                    AFRAME.cardState.secondCard.components['card-handler'].isFlipped = false;
                    AFRAME.cardState.firstCard = null;
                    AFRAME.cardState.secondCard = null;
                    AFRAME.cardState.canFlip = true;
                }, 1000);
            }
        }
    }
});

// game-handler.js

window.gameTime = 0;
window.pairsFound = 0;
window.timerInterval = null;

// Startet ein neues Spiel
window.startGame = function () {
    console.log("startGame");
    const cameraRig = document.querySelector('#cameraRig');
    cameraRig.setAttribute('position', '0 1 -4');
    cameraRig.setAttribute('rotation', '0 180 0');

    const mainMenu = document.querySelector('[menu-handler]');
    mainMenu.setAttribute('visible', false);

    const ingameMenu = document.querySelector('#ingameMenu');
    ingameMenu.setAttribute('visible', true);

    gameTime = 0;
    pairsFound = 0;
    updatePairsFound();
    timerInterval = setInterval(updateTimer, 1000);

    const gameManager = document.querySelector('[game-manager]').components['game-manager'];
    gameManager.startNewGame();
};

// Timer aktualisieren
window.updateTimer = function () {
    gameTime++;
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    const formattedTime = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const timerLabel = document.querySelector('#timerLabel');
    timerLabel.setAttribute('value', formattedTime);
}

// Gefundene Paare aktualisieren
window.updatePairsFound = function () {
    const pairsLabel = document.querySelector('#pairsLabel');
    pairsLabel.setAttribute('value', `Pairs Found: ${pairsFound}`);
    checkVictory();
};

// Überprüft, ob der Spieler gewonnen hat
window.checkVictory = function () {
    if (pairsFound === 8) { // Anzahl der Paare anpassen
        clearInterval(timerInterval);

        const victoryMessage = document.querySelector('#victoryMessage');
        const finalTimeLabel = document.querySelector('#finalTimeLabel');
        const finalPairsLabel = document.querySelector('#finalPairsLabel');

        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        const finalTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        finalTimeLabel.setAttribute('value', `Time: ${finalTime}`);
        finalPairsLabel.setAttribute('value', `Pairs Found: ${pairsFound}`);

        victoryMessage.setAttribute('visible', true);
        const ingameMenu = document.querySelector('#ingameMenu');
        ingameMenu.setAttribute('visible', false);

        // Ergebnis speichern und Leaderboard aktualisieren
        window.saveLeaderboardEntry(window.playerName, finalTime);

        // Nach 7 Sekunden ins Hauptmenü zurückkehren
        setTimeout(() => {
            victoryMessage.setAttribute('visible', false);
            window.backToMenu();
        }, 7000);
    }
};

window.resetGame = function () {
    // Timer zurücksetzen
    gameTime = 0;
    pairsFound = 0;
    updatePairsFound();

    // Timer neu starten
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    // Update timer display immediately
    const timerLabel = document.querySelector('#timerLabel');
    timerLabel.setAttribute('value', 'Time: 00:00');

    // Spielmanager für Neustart des Spiels
    const gameManager = document.querySelector('[game-manager]').components['game-manager'];
    gameManager.startNewGame();
}