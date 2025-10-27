(function () {

    AFRAME.registerComponent('portal-trigger', {
        init: function () {
            this.cameraEl = null;
        },

        tick: function () {
            // Ищем камеру, если ещё не нашли
            if (!this.cameraEl) {
                this.cameraEl = this.el.sceneEl.querySelector('[camera]');
                if (this.cameraEl) {
                    console.log('Камера найдена для portal-trigger', this.cameraEl);
                } else {
                    return; // Камера ещё не готова
                }
            }

            const portalPos = new THREE.Vector3();
            const playerPos = new THREE.Vector3();

            this.el.object3D.getWorldPosition(portalPos);
            this.cameraEl.object3D.getWorldPosition(playerPos);

            const dist = portalPos.distanceTo(playerPos);

            // console.log(dist);

            if (dist < 2 && this.el.object3D.visible) {
                console.log('Переход в следующую сцену!');
                window.location.href = 'winter.html';
            }
        }
    });


})();