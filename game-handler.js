AFRAME.registerComponent('game-manager', {
    selectRandomCards: function (count) {
        const shuffled = this.shuffleArray([...this.cardTypes]);
        return shuffled.slice(0, count);
    },

    init: function () {
        // Verfügbare Kartentexturen
        const cardTypes = [
            // Clubs
            '#club2', '#club3', '#club4', '#club5', '#club6',
            '#club7', '#club8', '#club9', '#club10',
            '#clubJ', '#clubQ', '#clubK', '#clubA',

            // Hearts
            '#heart2', '#heart3', '#heart4', '#heart5', '#heart6',
            '#heart7', '#heart8', '#heart9', '#heart10',
            '#heartJ', '#heartQ', '#heartK', '#heartA',

            // Diamonds
            '#diamond2', '#diamond3', '#diamond4', '#diamond5', '#diamond6',
            '#diamond7', '#diamond8', '#diamond9', '#diamond10',
            '#diamondJ', '#diamondQ', '#diamondK', '#diamondA',

            // Spades
            '#spade2', '#spade3', '#spade4', '#spade5', '#spade6',
            '#spade7', '#spade8', '#spade9', '#spade10',
            '#spadeJ', '#spadeQ', '#spadeK', '#spadeA'
        ];

        // Select 8 random cards for the memory game
        const selectedCards = this.selectRandomCards(8);
        let cards = [];
        selectedCards.forEach(card => {
            cards.push(card, card); // Create pairs
        });
        cards = this.shuffleArray(cards);

        // Karten im 4x4 Grid erstellen
        const spacing = 0.3;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cardIndex = row * 4 + col;
                if (cardIndex < cards.length) {
                    this.createCard(
                        col * spacing,
                        row * spacing,
                        cards[cardIndex]
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

    createCard: function (x, y, cardType) {
        const card = document.createElement('a-box');
        card.setAttribute('position', `${x} 0 ${y}`);
        card.setAttribute('rotation', '-90 0 0');
        card.setAttribute('depth', '0.001');
        card.setAttribute('height', '0.3');
        card.setAttribute('width', '0.2');
        card.setAttribute('material', 'src: #card-back; side: double');
        card.setAttribute('data-card', cardType);
        card.setAttribute('card-handler', '');
        card.setAttribute('class', 'card');

        this.el.appendChild(card);
    }
});