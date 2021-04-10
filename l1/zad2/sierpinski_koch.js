import { logoTurtle } from "/zad1/logoTurtle.js"

window.addEventListener('load', () => {
    const my_canvas = document.getElementById("turtle_canvas3");
    const degree_input = document.getElementById("degree");
    const sierpinski_button = document.getElementById("sierpinski");
    const koch_button = document.getElementById("koch");
    const logoturtle = new logoTurtle(my_canvas);
    const logoturtle2 = new logoTurtle(my_canvas);
    const width = 720;
    const height = 720;
    const size = 500; 
    const step = 300;

    koch_button.addEventListener('click', () => {
        var deep = degree_input.value;
        logoturtle2.context.lineWidth = 1;
        logoturtle2.example(250,500)
        logoturtle2.koch(step, deep)
        logoturtle2.exec_command('rt', 120)
        logoturtle2.koch(step, deep)
        logoturtle2.exec_command('rt', 120)
        logoturtle2.koch(step, deep)
        logoturtle2.exec_command('rt', 120)
    })

    sierpinski_button.addEventListener('click', () => {
        logoturtle.context.strokeStyle = 'black';
        logoturtle.context.lineWidth = 1;
        var degree = degree_input.value;
        drawSierpinski(degree)
    })

    function sierpinski(Ax,Ay,Bx,By,Cx,Cy,d, step) {
        if(d>0) {
            var pointAx = (Bx + Cx) / 2;
            var pointAy = (By + Cy) / 2;
            var pointBx = (Ax + Cx) / 2;
            var pointBy = (Ay + Cy) / 2;
            var pointCx = (Ax + Bx) / 2;
            var pointCy = (Ay + By) / 2;
     
            var d2 = d-1;
            var step2 = step/2;
            sierpinski(Ax,Ay,pointBx,pointBy,pointCx,pointCy,d2,step2);
            sierpinski(pointCx,pointCy,pointAx,pointAy,Bx,By,d2,step2);
            sierpinski(pointBx,pointBy,pointAx,pointAy,Cx,Cy,d2,step2);
        }
        else{
            logoturtle.draw_triangle(Ax,Ay, step)
        }
    }

    function drawSierpinski(deep) {

        var midPointX = width/2;
        var midPointY = height/2;
     
        var ri = (size/6) * Math.sqrt(3);
        var ru = (size/3) * Math.sqrt(3);
     
        var pointAx = midPointX-(size/2);
        var pointAy = midPointY+ri;
        var pointBx = midPointX+(size/2);
        var pointBy = midPointY+ri;
        var pointCx = midPointX;
        var pointCy = midPointY-ru;
        
        sierpinski(pointAx,pointAy,pointBx,pointBy,pointCx,pointCy,deep,size);
    }
})