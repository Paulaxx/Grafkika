import { logoTurtle } from "./logoTurtle.js"

window.addEventListener('load', () => {
    const my_canvas = document.getElementById("turtle_canvas");
    const command_input = document.getElementById("run");
    const doit_button = document.getElementById("doit");
    const logoturtle = new logoTurtle(my_canvas);
    
    const exec = () => {
        logoturtle.split_command(command_input.value);
        command_input.value = '';
    };

    doit_button.addEventListener('click', exec);

    run.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            exec();
        }
    });
})