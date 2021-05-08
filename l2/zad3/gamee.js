import { WebGL } from "./webgl.js";
import { Player, BackgroundRectangle, FallingStars } from "./objects.js"


var _canvas;
var _webGL;
var _player;
var _all = [];
var _lastTime;
var _stars = [];
var _last_star_time;
var _pkt = 0;
var _show_pkt;

function startGame() {
    _canvas = document.getElementById("game_canvas");
    _show_pkt = document.getElementById("pkt");
    _webGL = new WebGL(_canvas);

    _player = new Player();
    _all.push(_player);

    for (let i = 0; i < 30; i++) {
        let bck = new BackgroundRectangle();
        _all.push(bck);
    }

    for (let i = 0; i < 1; i++) {
        let star = new FallingStars();
        star.calculate_verticles();
        _all.push(star);
        _stars.push(star);
        _last_star_time = window.performance.now();
    }

    _webGL.draw(_all);



    window.addEventListener('keypress', function (e) {
        if (e.key === 'd') {
            _player.move(5);
        }
        else if (e.key === 'a') {
            _player.move(-5);
        }

        _webGL.draw(_all);
    });

    _lastTime = window.performance.now();
    window.requestAnimationFrame(animation);
}


function animation(time) {
    var timeDelta = time - _lastTime;
    _lastTime = time;

    for (let i = 0; i < _stars.length; i++) {
        let star = _stars[i];
        star.move(0.1 * timeDelta);
        if (star.info.y > 720) {
            _stars.splice(i, 1);
            let id = _all.findIndex(y => y === star);
            if (id !== -1) {
                _all.splice(id, 1);
            }
        }
        else if (star.info.y >= 700 && Math.abs(star.info.x - _player.info.x) < 40) {
            _stars.splice(i, 1);
            let id = _all.findIndex(y => y === star);
            if (id !== -1) {
                _all.splice(id, 1);
            }
            _pkt += 1;
            _show_pkt.innerText = `Punkty: ${_pkt}`
        }
    }

    let delta_star = time - _last_star_time;
    if (delta_star > 1500) {
        let star = new FallingStars();
        star.calculate_verticles();
        _all.push(star);
        _stars.push(star);
        _last_star_time = time;
    }


    _webGL.draw(_all);
    window.requestAnimationFrame(animation);
}



window.onload = startGame;