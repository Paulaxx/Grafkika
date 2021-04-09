import { logoTurtle } from "/logoTurtle.js"

window.addEventListener('load', () => {
    const my_canvas = document.getElementById("turtle_canvas2");
    const start_button = document.getElementById("start");
    const logoturtle = new logoTurtle(my_canvas);

    start_button.addEventListener('click', () => {
        logoturtle.example(360, 360)
        logoturtle.exec_command('rt', 90)
        logoturtle.exec_command('fwd', 10)
        logoturtle.exec_command('lt', 120)
        logoturtle.exec_command('fwd', 10)
        logoturtle.exec_command('lt', 120)
        logoturtle.exec_command('fwd', 10)
    })
})