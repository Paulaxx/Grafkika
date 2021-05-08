import { WebGL } from "./webgl.js";
import { Turtle } from "./turtle.js";

var _canvas;
var _webGL;
var _radio_buttons = [];
var _checked_turtle;
var turtles = [];

function onload() {
    var sierpinski = document.getElementById("sierpinski");
    var koch = document.getElementById("koch");

    _canvas = document.getElementById("sierpinski_koch_canvas");
    _webGL = new WebGL(_canvas);

    sierpinski.onclick = sierpinskiDraw;
    koch.onclick = kochDraw;

    get_radio_buttons();

    window.addEventListener('keypress', function (e) {
        let checked = check_radio_buttons();
        if (checked !== null) {
            if (e.key === 'd') {
                turtles[_checked_turtle].move(5, 0);
            }
            else if (e.key === 'w') {
                turtles[_checked_turtle].move(0, -5);
            }
            else if (e.key === 'a') {
                turtles[_checked_turtle].move(-5, 0);
            }
            else if (e.key === 's') {
                turtles[_checked_turtle].move(0, 5);
            }
            else if (e.key === 'j') {
                turtles[_checked_turtle].changeZ(0.1);
            }
            else if (e.key === 'l') {
                turtles[_checked_turtle].changeZ(-0.1);
            }

            _webGL.draw(turtles, "LINE_STRIP");
        }
    });
}

function sierpinskiDraw() {
    turtles = [];
    for (let i = 0; i < 7; i++) {
        let z = Math.random() * 2 - 1;
        var turtle = new Turtle(z);
        turtle.draw_sierpinski(300 + i * 10, 1 + i);
        turtles.push(turtle)
    }

    _webGL.draw(turtles, "LINE_STRIP");
}

function kochDraw() {
    turtles = [];
    for (let i = 0; i < 7; i++) {
        let z = Math.random() * 2 - 1;
        var turtle = new Turtle(z);
        turtle.draw_koch(300 + i * 10, 1 + i);
        turtles.push(turtle)
    }

    _webGL.draw(turtles, "LINE_STRIP");
}

function get_radio_buttons() {
    _radio_buttons = []
    for (let i = 0; i < 7; i++) {
        var name = `z${i + 1}`
        _radio_buttons.push(document.getElementById(name));
    }
}

function check_radio_buttons() {
    for (let button of _radio_buttons) {
        if (button.checked) {
            _checked_turtle = button.value;
            return button
        }
    }
    return null;
}

window.onload = onload();