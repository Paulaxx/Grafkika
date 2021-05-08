import {Game_canvas} from "./game_canvas.js";
import {cuboid} from "./cuboid.js";

// ilosc losowych prostopadloscianow
let how_many_cuboids = 200;
// rozmiar losowych prostopadloscianow
let size = {
    x: 7000,
    y: 6000,
    z: 10000
};


const [speedUp, pitchUp, rollUp] = [0.2, 0.005 * Math.PI / 180, 0.005 * Math.PI / 180];
const [slowDown, yawDown, pitchDown, rollDown] = [0.01, 0.001 * Math.PI / 180, 0.001 * Math.PI / 180, 0.001 * Math.PI / 180];
const [maxSpeed, maxPitch, maxRoll] = [20, 2 * Math.PI / 180, 1.5 * Math.PI / 180];


// odtworzenie prostopadłościanu oraz usunięcie starego celu
function recreate(target, game_canvas, style = '#FA8072') {
    if (target) game_canvas.delete_cuboid(target);
    let randomStart = {
        x: ((Math.random() - 0.5) * 2) * size.x + (Math.random() > 0.5 ? -1 : 1) * 1000,
        y: ((Math.random() - 0.5) * 2) * size.y + (Math.random() > 0.5 ? -1 : 1) * 1000,
        z: ((Math.random() - 0.5) * 2) * size.z
    };
    const newTarget = new cuboid(randomStart, {
        x: randomStart.x + 100 + Math.random()*how_many_cuboids/5,
        y: randomStart.y + 100 + Math.random()*how_many_cuboids/5,
        z: randomStart.z + 100 + Math.random()*how_many_cuboids/5
    }, target ? target.style : style);
    game_canvas.add_cuboid(newTarget);
    return newTarget;
}

// stworzenie nowego celu
function respawn(target, game_canvas, style = '#FA8072') {
    let randomTarget = game_canvas.cuboids[Math.floor(game_canvas.cuboids.length * Math.random())].hit_the_target().center;
    let randomStart = {
        x: randomTarget.x + (Math.random() - 0.5) * 100,
        y: randomTarget.y + (Math.random() - 0.5) * 100,
        z: randomTarget.y + (Math.random() - 0.5) * 100
    };
    const newTarget = new cuboid(randomStart, {
        x: randomStart.x + 100,
        y: randomStart.y + 100,
        z: randomStart.z + 100
    }, target ? target.style : style);
    game_canvas.add_cuboid(newTarget);
    return newTarget;
}

// funkcja obliczająca dystans pomiędzy dwoma punktami
function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
}

window.addEventListener('load', () => {
    let perspective = 600;
    const canvas = document.getElementById('3Dgame_canvas');
    const game_canvas = new Game_canvas(canvas, perspective);

    canvas.getContext('2d').font = '30px Consolas';
    canvas.getContext('2d').fillText('Loading...', 0, 0);
    for (let i = 0; i < how_many_cuboids; i++) {
        recreate(null, game_canvas);
    }

    let target = recreate(null, game_canvas, '#ffffff');

    const controls = new Keyboard(window);
    let [vz, yaw, pitch, roll] = [0, 0, 0, 0];

    // akcje wykonywane po kliknięciu odpowiedniego klawisza
    controls.onKey('ArrowDown', (timeFactor) => roll = Math.min(roll + rollUp * timeFactor, maxRoll));
    controls.onKey('ArrowUp', (timeFactor) => roll = Math.max(roll - rollUp * timeFactor, -maxRoll));
    controls.onKey('ArrowLeft', (timeFactor) => pitch = Math.min(pitch + pitchUp * timeFactor, maxPitch));
    controls.onKey('ArrowRight', (timeFactor) => pitch = Math.max(pitch - pitchUp * timeFactor, -maxPitch));
    controls.onKey('w', (timeFactor) => vz = Math.max(vz - speedUp * timeFactor, -maxSpeed));
    controls.onKey('s', (timeFactor) => vz = Math.min(vz + speedUp / 5 * timeFactor, maxSpeed));

    let previousTimestamp = 0;
    let rerender = (timestamp) => {
        let timeFactor = timestamp - previousTimestamp;
        controls.tick(timeFactor);

        // zaktualizowanie zmiennych potrzebnych do zrenderowania obrazu
        vz > 0 ? vz -= Math.min(slowDown * timeFactor, vz) : vz -= Math.max(-slowDown * timeFactor, vz);
        pitch > 0 ? pitch -= Math.min(pitchDown * timeFactor, pitch) : pitch -= Math.max(-pitchDown * timeFactor, pitch);
        yaw > 0 ? yaw -= Math.min(yawDown * timeFactor, yaw) : yaw -= Math.max(-yawDown * timeFactor, yaw);
        roll > 0 ? roll -= Math.min(rollDown * timeFactor, roll) : roll -= Math.max(-rollDown * timeFactor, roll);

        game_canvas.move(0, 0, vz);
        game_canvas.camera_rotation(pitch, roll, yaw);
        game_canvas.draw();

        for (let shape of game_canvas.cuboids) {

            //jesli odleglosc pomiedzy srodkiem danej figury, a aktualną pozycją jest mniejsza niż odległość od środka figury do krawędzi figury
            // to znaczy że najechaliśmy na daną figurę
            if (distance(shape.hit_the_target().center, {x: 0, y: 0, z: -perspective}) < shape.hit_the_target().radius) {

                //jeśli ta figura to nasz cel, co odtwarzamy wszystkie pozostałe figury, a cel zostaje 'wymazany'
                if (shape === target) {
                    //szukanie celu w tablicy figur
                    for (let i = 0; i < game_canvas.cuboids.length; i++) {
                        let shape = game_canvas.cuboids[i];
                        if (shape !== target) {
                            setTimeout(() => {
                                recreate(shape, game_canvas);
                            }, i * 10);
                        } else {
                            target = recreate(target, game_canvas);
                        }
                    }
                    break;
                } else {
                    respawn(shape, game_canvas);
                }
            }
        }

        previousTimestamp = timestamp;
        window.requestAnimationFrame(rerender);
    };

    //odswiezenie animacji poprzez funkcje rerender
    window.requestAnimationFrame(rerender);
});
