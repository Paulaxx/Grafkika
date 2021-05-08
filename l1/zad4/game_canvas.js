// klasa odpowiedzialna za prechowywanie figur, dodawanie nowych, usuwanie, rysowanie ich na canvasie, oraz zmianę widoku przy zmianie widoku kamery

export class Game_canvas {
    constructor(canvas, perspective) {
        this.context = canvas.getContext('2d');
        this.height = canvas.height / 2;
        this.width = canvas.width / 2;

        this.cuboids = [];
        this.dots = [];
        this.perspective = perspective;
    }

    //dodanie nowych figur(prostopadłościanów)
    add_cuboid(...cuboids) {
        this.cuboids = [...this.cuboids, ...cuboids];
        this.dots = [...this.dots, ...cuboids.reduce((acc, shape) => [...acc, ...shape.return_moves()], [])];
    }

    // usunięcie białego prostopadłościanu - celu, po najechaniu w niego
    delete_cuboid(shapeToRemove) {
        let found = this.cuboids.indexOf(shapeToRemove);
        if (found !== -1) {
            this.cuboids.splice(found, 1);
            const remove_dots = shapeToRemove.return_moves();
            for (let i = 0; i < this.dots.length; i++) {
                found = remove_dots.indexOf(this.dots[i]);
                if (found !== -1) {
                    this.dots.splice(i, 1);
                    i--;
                }
            }
        }
    }

    // przesunięcie 
    move(dx = 0, dy = 0, dz = 0) {
        this.dots.forEach(point => {
            point.x += dx;
            point.y += dy;
            point.z += dz;
        });
    }

    // renderowanie figur
    render(renderList, style) {
        this.context.beginPath();
        renderList.forEach(renderPoint => {
            this.context.moveTo(renderPoint.start.x + this.width, renderPoint.start.y + this.height);
            this.context.lineTo(renderPoint.end.x + this.width, renderPoint.end.y + this.height);
        });
        this.context.strokeStyle = style;
        this.context.stroke();
    }

    // rotacja
    rotation(pitch = 0, roll = 0, yaw = 0) {
        let cosA = Math.cos(yaw);
        let sinA = Math.sin(yaw);

        let cosB = Math.cos(pitch);
        let sinB = Math.sin(pitch);

        let cosC = Math.cos(roll);
        let sinC = Math.sin(roll);

        let Axx = cosA*cosB;
        let Axy = cosA*sinB*sinC - sinA*cosC;
        let Axz = cosA*sinB*cosC + sinA*sinC;

        let Ayx = sinA*cosB;
        let Ayy = sinA*sinB*sinC + cosA*cosC;
        let Ayz = sinA*sinB*cosC - cosA*sinC;

        let Azx = -sinB;
        let Azy = cosB*sinC;
        let Azz = cosB*cosC;

        return [
          [Axx, Axy, Axz],
          [Ayx, Ayy, Ayz],
          [Azx, Azy, Azz]
        ];
    }

    // rotacja kamery
    camera_rotation(pitch = 0, roll = 0, yaw = 0) {
        let matrix = this.rotation(pitch, roll, yaw);

        this.dots.forEach(point => {
            let [px, py, pz] = [point.x, point.y, point.z + this.perspective];

            point.x = matrix[0][0]*px + matrix[0][1]*py + matrix[0][2]*pz;
            point.y = matrix[1][0]*px + matrix[1][1]*py + matrix[1][2]*pz;
            point.z = matrix[2][0]*px + matrix[2][1]*py + matrix[2][2]*pz - this.perspective;
        });
    }

    // rysowanie w canvasie wszystkich figur(prostopadłościanów)
    draw() {
        this.context.clearRect(0, 0, this.width * 2 + 1, this.height * 2 + 1);
        this.cuboids.forEach(shape => {
            this.render(shape.return_lines().reduce((acc, line) => [...acc, ...line.project(this.perspective)], []), shape.style);
        });
    }
}