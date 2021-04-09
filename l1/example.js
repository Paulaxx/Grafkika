import { logoTurtle } from "/logoTurtle.js"

window.addEventListener('load', () => {
    const my_canvas = document.getElementById("turtle_canvas2");
    const start_button = document.getElementById("start");
    const logoturtle = new logoTurtle(my_canvas);
    const logoturtle2 = new logoTurtle(my_canvas);
    const logoturtle3 = new logoTurtle(my_canvas);

    start_button.addEventListener('click', () => {
        logoturtle.example(360, 360)
        logoturtle.change_color('#FA8072')
        logoturtle.exec_command('rt', 90)
        logoturtle.exec_command('fwd', 20)
        logoturtle.exec_command('lt', 120)
        logoturtle.exec_command('fwd', 20)
        logoturtle.exec_command('lt', 120)
        logoturtle.exec_command('fwd', 20)

        logoturtle2.example(230, 230)
        logoturtle2.change_color('#8A2BE2')
        logoturtle2.exec_command('rt', 45)
        logoturtle2.exec_command('fwd', 20)
        logoturtle2.exec_command('lt', 90)
        logoturtle2.exec_command('fwd', 20)
        logoturtle2.exec_command('lt', 90)
        logoturtle2.exec_command('fwd', 20)
        logoturtle2.exec_command('lt', 90)
        logoturtle2.exec_command('fwd', 20)

        logoturtle2.example(20, 230)
        logoturtle2.change_color('#FFB6C1')
        logoturtle2.exec_command('rt', 45)
        logoturtle2.exec_command('fwd', 20)
        logoturtle2.exec_command('lt', 90)
        logoturtle2.exec_command('fwd', 20)
        logoturtle2.exec_command('lt', 90)
        logoturtle2.exec_command('fwd', 20)
        logoturtle2.exec_command('lt', 90)
        logoturtle2.exec_command('fwd', 20)

        logoturtle3.example(400, 700)
        logoturtle3.change_color('#87CEEB')
        logoturtle3.exec_command('rt', 60)
        logoturtle3.exec_command('fwd', 20)
        logoturtle3.exec_command('lt', 60)
        logoturtle3.exec_command('fwd', 20)
        logoturtle3.exec_command('lt', 60)
        logoturtle3.exec_command('fwd', 20)
        logoturtle3.exec_command('lt', 60)
        logoturtle3.exec_command('fwd', 20)
        logoturtle3.exec_command('lt', 60)
        logoturtle3.exec_command('fwd', 20)
        logoturtle3.exec_command('lt', 60)
        logoturtle3.exec_command('fwd', 20)
    })
})