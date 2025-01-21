AFRAME.registerComponent('menu-handler', {
    init: function () {
        const flexContainer = document.createElement('a-gui-flex-container');

        // Set container attributes
        flexContainer.setAttribute('flex-direction', 'column');
        flexContainer.setAttribute('justify-content', 'center');
        flexContainer.setAttribute('align-items', 'normal');
        flexContainer.setAttribute('component-padding', '0.1');
        flexContainer.setAttribute('opacity', '0.7');
        flexContainer.setAttribute('width', '3.5');
        flexContainer.setAttribute('height', '4.5');
        flexContainer.setAttribute('panel-color', '#072B73');
        flexContainer.setAttribute('panel-rounded', '0.2');

        // Create buttons
        const buttonLabels = ['Start Game', 'Reset Game', 'Exit'];
        buttonLabels.forEach(label => {
            const button = document.createElement('a-gui-button');
            button.setAttribute('width', '2.5');
            button.setAttribute('height', '0.75');
            button.setAttribute('value', label);
            button.setAttribute('font-size', '0.25');
            button.setAttribute('margin', '0 0 0.2 0');

            flexContainer.appendChild(button);
        });

        // Add container to menu entity
        this.el.appendChild(flexContainer);
    }
});