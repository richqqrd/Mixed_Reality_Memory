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
        const startPosition = isAR ? { x: -0.5, z: -0.5 } : { x: -0.1, z: 0 }; // Adjust VR start position here
        const spacing = isAR ? 0.2 : 0.4; // Kleinere Abstände in AR
        const size = isAR ? { width: 0.1, height: 0.15 } : { width: 0.2, height: 0.3 }; // Größere Karten in VR
        this.createCardsGrid(startPosition, spacing, size);
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