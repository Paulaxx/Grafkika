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
    var str = ""

    function line(x1, y1, x2, y2, color, width) {
        return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:' + color + ';stroke-width:' + width + '" />' + "\n";
    }

    sierpinski_button.addEventListener('click', () => {
        var deep = degree_input.value;
        drawSierpinski(deep)
        svg.innerHTML = str
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

});