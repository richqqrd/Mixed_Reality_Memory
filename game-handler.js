AFRAME.registerComponent('card-handler', {
    init: function () {
        let isFlipped = false;
        let firstCard = null;
        let secondCard = null;
        let canFlip = true;

        this.el.addEventListener('click', function () {
            if (!canFlip) return;

            const cardFront = this.getAttribute('data-card');

            if (!isFlipped) {
                // First card flip
                this.setAttribute('material', `src: ${cardFront}; side: double`);
                if (!firstCard) {
                    firstCard = this;
                } else {
                    secondCard = this;
                    canFlip = false;

                    // Check for match
                    if (firstCard.getAttribute('data-card') === secondCard.getAttribute('data-card')) {
                        // Match found
                        firstCard = null;
                        secondCard = null;
                        canFlip = true;
                    } else {
                        // No match, flip back
                        setTimeout(() => {
                            firstCard.setAttribute('material', 'src: #card-back; side: double');
                            secondCard.setAttribute('material', 'src: #card-back; side: double');
                            firstCard = null;
                            secondCard = null;
                            canFlip = true;
                        }, 1000);
                    }
                }
            }
            isFlipped = !isFlipped;
        });
    }
});