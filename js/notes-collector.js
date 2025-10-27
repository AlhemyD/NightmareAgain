(function () {

    let noteCollected = 0;

    // Компонент для загадки: собирание записок
    AFRAME.registerComponent('collect-note', {
        schema: {
            count: { type: 'int', default: 0 },
            goal: { type: 'int', default: 3 } // сколько записок нужно
        },

        init: function () {
            const el = this.el;
            const sceneEl = el.sceneEl;
            let pianoClicked = false;

            // камеру ищем, когда сцена загрузится полностью
            const findCamera = () => {
                this.cameraEl = sceneEl.querySelector('[camera]');
                if (this.cameraEl) {
                    console.log('Камера найдена:', this.cameraEl);
                } else {
                    console.warn('Камера пока не найдена, пробую снова...');
                    setTimeout(findCamera, 500);
                }
            };
            findCamera();

            this.el.addEventListener('click', () => {
                if (this.el.id === "piano" && !pianoClicked) {
                    noteCollected++;
                    pianoClicked = true;
                    const soundEl = document.querySelector('#piano-sound');
                    soundEl.components.sound.playSound(); // воспроизвести
                    console.log("Играем на пианино, добавить звук");
                    // Убираем визуальную подсказку
                    document.querySelector('#box').setAttribute('visible', 'false');
                }
                if (!this.cameraEl) {
                    console.log('Камера ещё не готова, попробуйте снова через секунду.');
                    return;
                }
                // получаем позиции записки и камеры
                const notePos = new THREE.Vector3();
                const camPos = new THREE.Vector3();
                this.el.object3D.getWorldPosition(notePos);
                this.cameraEl.object3D.getWorldPosition(camPos);

                // считаем расстояние (только по плоскости XZ)
                const dx = notePos.x - camPos.x;
                const dz = notePos.z - camPos.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                // console.log(distance);

                if ((distance <= 4 && distance > 0) || (el.id === "crystall" && distance > 0 && distance <= 10) || (el.id === "piano" && distance > 0 && distance <= 8)) {


                    this.data.count++;
                    noteCollected++;
                    // Можно обновлять интерфейс
                    //alert('Записка собрана: ' + this.data.count);
                    // Удаляем записку из сцены

                    if (this.el.id !== "piano") {
                        this.el.parentNode.removeChild(this.el);
                    } else if (pianoClicked) {
                        noteCollected -= 1;
                    }

                    if (noteCollected >= this.data.goal) {
                        document.querySelector('#portal').setAttribute('visible', 'true');
                        //document.querySelector('#portalTrigger').setAttribute('visible', 'true');
                        //alert('Вы собрали все записки! Портал открылся!');
                    }
                    
                } else {
                    console.log("Note too far");
                    return;
                }
            });
        }
    });
})();