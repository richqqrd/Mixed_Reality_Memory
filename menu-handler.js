AFRAME.registerSystem('three-mesh-ui', {
    init: function () {
        this.update = ThreeMeshUI.update
    },
    tick: function () {
        this.update()
    }
});




AFRAME.registerComponent('menu-handler', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            const value = evt.target.getAttribute('text').value;

            switch (value) {
                case 'Start Game':
                    // Start game logic
                    console.log('Starting game...');
                    break;
                case 'Settings':
                    // Settings logic
                    console.log('Opening settings...');
                    break;
            }
        });
    }
});