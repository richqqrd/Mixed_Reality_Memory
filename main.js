// main.js

document.addEventListener('DOMContentLoaded', () => {
    const sceneEl = document.querySelector('a-scene');

    sceneEl.addEventListener('loaded', () => {
        sceneEl.addEventListener('enter-vr', () => {
            const isAR = sceneEl.renderer.xr.getSession().environmentBlendMode === 'additive' ||
                sceneEl.renderer.xr.getSession().environmentBlendMode === 'alpha-blend';

            document.querySelectorAll('.ar-exclude').forEach(el => {
                el.setAttribute('visible', !isAR);
            });

            if (isAR) {
                const skyEl = document.querySelector('a-sky');
                if (skyEl) {
                    skyEl.setAttribute('visible', false);
                }

                sceneEl.renderer.setClearColor(new THREE.Color(0x000000), 0); // Transparenter Hintergrund
            } else {
                const skyEl = document.querySelector('a-sky');
                if (skyEl) {
                    skyEl.setAttribute('visible', true);
                }

                sceneEl.renderer.setClearColor(new THREE.Color(0x111111), 1); // Dunkler Hintergrund
            }
        });
    });
});