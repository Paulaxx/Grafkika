export class Player {

    constructor(z = -1, size = 40) {
        this.info = {
            x: 360, y: 700, z: z,
            color: [Math.random(), Math.random(), Math.random(), 1],
            type: "TRIANGLE_FAN"
        };
        let posx = this.info.x;
        let posy = this.info.y;
        this.points = [
            { x: posx - size / 2, y: posy - size / 2 },
            { x: posx - size / 2, y: posy + size / 2 },
            { x: posx + size / 2, y: posy + size / 2 },
            { x: posx + size / 2, y: posy - size / 2 },
            { x: posx - size / 2, y: posy - size / 2 },
        ];
        this.textured = false;
    }


    move(x) {
        this.points.forEach(point => {
            point.x += x;
        })

        this.info.x += x;
    }

    changeZ(z) {
        this.info.z += z;
    }

}

export class BackgroundRectangle {

    constructor(z = 0.5, size = 60) {
        this.info = {
            x: Math.random() * 720, y: Math.random() * 720, z: z,
            color: [Math.random(), Math.random(), Math.random(), 0.25],
            type: "TRIANGLE_FAN"
        };
        let posx = this.info.x;
        let posy = this.info.y;
        this.points = [
            { x: posx - size / 2, y: posy - size / 2 },
            { x: posx - size / 2, y: posy + size / 2 },
            { x: posx + size / 2, y: posy + size / 2 },
        ];
        this.textured = false;
    }


    move(x) {
        this.points.forEach(point => {
            point.x += x;
        })

        this.info.x += x;
    }

    changeZ(z) {
        this.info.z += z;
    }

}

export class FallingStars {

    constructor(z = -0.5, size = 60) {
        this.info = {
            x: Math.random() * 720, y: 0, z: z,
            color: [Math.random(), Math.random(), Math.random(), 0.4],
            type: "TRIANGLE_FAN"
        };
        this.points = [];
        this.textured = false;
    }

    calculate_verticles() {

        let w = this.info.x;
        let h = this.info.y;
        var alpha = (2 * Math.PI) / 10;
        var radius = Math.random() * 28 + 20;
        var starXY = [50 + Math.random() * w, Math.random() * (h - 100) + 50];
        [this.info.x, this.info.y] = [starXY[0], starXY[1]];
        this.points.push({ x: starXY[0], y: starXY[1] });
        for (var ii = 11; ii != 0; ii--) {
            var r = radius * (ii % 2 + 1) / 2;
            var omega = alpha * ii;
            this.points.push({ x: (r * Math.sin(omega)) + starXY[0], y: (r * Math.cos(omega)) + starXY[1] });
        }

    }


    move(y) {
        this.points.forEach(point => {
            point.y += y;
        })

        this.info.y += y;
    }

    changeZ(z) {
        this.info.z += z;
    }

}
