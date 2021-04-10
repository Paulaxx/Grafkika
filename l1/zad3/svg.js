import { logoTurtle } from "/zad1/logoTurtle.js"

window.addEventListener('load', () => {
    const svg = document.getElementById("turtle_svg");
    const degree_input = document.getElementById("degree");
    const sierpinski_button = document.getElementById("sierpinski");
    const koch_button = document.getElementById("koch");
    const width = 720;
    const height = 720;
    const size = 500; 
    const step = 300;
    var rotation = 90
    var x = 250
    var y = 500
    var str = ""

    function line(x1, y1, x2, y2, color, width) {
        return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:' + color + ';stroke-width:' + width + '" />' + "\n";
    }

    sierpinski_button.addEventListener('click', () => {
        var deep = degree_input.value;
        drawSierpinski(deep)
        svg.innerHTML = str
        str = ""
    })

    koch_button.addEventListener('click', () => {
        var deep = degree_input.value;
        koch(step, deep)
        command('rt', 120)
        koch(step, deep)
        command('rt', 120)
        koch(step, deep)
        command('rt', 120)

        console.log(str)
        svg.innerHTML = str
        str = ""
    })

    function sierpinski(Ax,Ay,Bx,By,Cx,Cy,d) {
        if(d>0) {
            var pointAx = (Bx + Cx) / 2;
            var pointAy = (By + Cy) / 2;
            var pointBx = (Ax + Cx) / 2;
            var pointBy = (Ay + Cy) / 2;
            var pointCx = (Ax + Bx) / 2;
            var pointCy = (Ay + By) / 2;

            var d2 = d-1;
            sierpinski(Ax,Ay,pointBx,pointBy,pointCx,pointCy,d2);
            sierpinski(pointCx,pointCy,pointAx,pointAy,Bx,By,d2);
            sierpinski(pointBx,pointBy,pointAx,pointAy,Cx,Cy,d2);
        }
        else {
            var l = line(Ax, Ay, Bx, By, 'red', 1)
            str += l
            var l = line(Bx, By, Cx, Cy, 'red', 1)
            str += l
            var l = line(Cx, Cy, Ax, Ay, 'red', 1)
            str += l
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
     
        sierpinski(pointAx,pointAy,pointBx,pointBy,pointCx,pointCy,deep);
    }

    function rotate(angle) {
        rotation = ((rotation - angle) % 360 + 360) % 360;
    }

    function command(comm, param) {
        switch(comm){
            case "fwd": {
                var x2 = x + param * Math.cos(rotation * Math.PI/180);
                var y2 = y - param * Math.sin(rotation * Math.PI/180);
                var l = line(x, y, x2, y2, 'red', 1)
                console.log(x, y, x2, y2)
                x = x2
                y = y2
                str += l
                break;
            }
            case "lt": {
                rotate(-param);
                break;
            }
            case "rt": {
                rotate(param);
                break;
            }
        }
    }

    function koch(step, deep) {
        if(deep == 0){
            command('fwd', step)
        }
        else{
            step = step/3
            koch(step, deep-1)
            command('lt', 60)
            koch(step, deep-1)
            command('rt', 120)
            koch(step, deep-1)
            command('lt', 60)
            koch(step, deep-1)
        }
    }

});