export class Turtle {

    constructor(z) {
        this.turtle = { x: 250, y: 500, z: z, rotation: 45, color: [Math.random(), Math.random(), Math.random(), 1] };
        this.points = [{ x: 250, y: 500 }];
    }

    draw_sierpinski(length, depth) {
        if (depth === 0)
            for (let i = 0; i < 3; i++) {
                this.fd(length)
                this.left(120)
            }
        else {
            this.draw_sierpinski(length / 2, depth - 1)
            this.fd(length / 2)
            this.draw_sierpinski(length / 2, depth - 1)
            this.bk(length / 2)
            this.left(60)
            this.fd(length / 2)
            this.right(60)
            this.draw_sierpinski(length / 2, depth - 1)
            this.left(60)
            this.bk(length / 2)
            this.right(60)
        }
    }

    draw_koch(length, depth) {
        this.koch(length, depth)
        this.right(120)
        this.koch(length, depth)
        this.right(120)
        this.koch(length, depth)
        this.right(120)
    }

    koch(length, depth) {
        if (depth === 0) {
            this.fd(length)
            return
        }
        length = length / 3.0
        this.koch(length, depth - 1)
        this.left(60)
        this.koch(length, depth - 1)
        this.right(120)
        this.koch(length, depth - 1)
        this.left(60)
        this.koch(length, depth - 1)
    }

    walk(step) {
        this.turtle.x += step * Math.cos(this.turtle.rotation * Math.PI / 180);
        this.turtle.y -= step * Math.sin(this.turtle.rotation * Math.PI / 180);
        this.points.push({ x: this.turtle.x, y: this.turtle.y });
    }

    rotate(angle) {
        this.turtle.rotation = ((this.turtle.rotation - angle) % 360 + 360) % 360;
    }

    bk(step) {
        this.walk(-step)
    }

    fd(step) {
        this.walk(step)
    }

    left(angle) {
        this.rotate(-angle);
    }

    right(angle) {
        this.rotate(angle);
    }

    move(x, y) {
        this.points.forEach(point => {
            point.x += x;
            point.y += y;
        })
    }

    changeZ(z) {
        this.turtle.z += z;
    }

}
