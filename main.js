// main.js

document.addEventListener('DOMContentLoaded', () => {
    const sceneEl = document.querySelector('a-scene');

    sceneEl.addEventListener('loaded', () => {
        // Event für den Wechsel in AR/VR-Modus
        sceneEl.addEventListener('enter-vr', () => {
            const isAR = sceneEl.renderer.xr.getSession().environmentBlendMode === 'additive' ||
                sceneEl.renderer.xr.getSession().environmentBlendMode === 'alpha-blend';

            // Elemente mit der Klasse "ar-exclude" ein- oder ausblenden
            document.querySelectorAll('.ar-exclude').forEach(el => {
                el.setAttribute('visible', !isAR);
            });

            if (isAR) {
                // Deaktiviere Skybox
                const skyEl = document.querySelector('a-sky');
                if (skyEl) {
                    skyEl.setAttribute('visible', false);
                }

                // Setze den Hintergrund des Renderers auf transparent
                sceneEl.renderer.setClearColor(new THREE.Color(0x000000), 0); // Transparenter Hintergrund
            } else {
                // Reaktiviere Skybox und Hintergrundfarbe für VR
                const skyEl = document.querySelector('a-sky');
                if (skyEl) {
                    skyEl.setAttribute('visible', true);
                }

                // Setze eine Hintergrundfarbe für VR
                sceneEl.renderer.setClearColor(new THREE.Color(0x111111), 1); // Dunkler Hintergrund
            }
        });
    });
});