export class logoTurtle{

    constructor(canvas) {
        this.context = canvas.getContext("2d");
        this.context.lineWidth = 5;
        this.canvas_width = canvas.width
        this.canvas_height = canvas.height
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.context.strokeStyle = '#87CEEB'
        this.rotation = 90
        this.minX = 0
        this.minY = 0
        this.maxX = 100
        this.maxY = 100
        this.draw = true
    }

    example(x, y) {
        this.x = x
        this.y = y
    }

    change_color(color){
        this.context.strokeStyle = color
    }

    rotate(angle) {
        this.rotation = ((this.rotation - angle) % 360 + 360) % 360;
    }

    walk(step){
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.x += step * Math.cos(this.rotation * Math.PI/180);
        this.y -= step * Math.sin(this.rotation * Math.PI/180);
        this.context.lineTo(this.x, this.y);
        if (this.draw) 
            this.context.stroke();
    }

    split_command(command){
        const commands = command.split(' ');
        const comm = commands[0];
        const step = commands[1];
        this.exec_command(comm, step);
    }

    exec_command(command, step){
        switch(command){
            case "fwd": {
                this.walk((step/(this.maxY-this.minY))*this.canvas_height)
                break;
            }
            case "bkw": {
                this.walk(-(step/(this.maxY-this.minY))*this.canvas_height)
                break;
            }
            case "lt": {
                this.rotate(-step);
                break;
            }
            case "rt": {
                this.rotate(step);
                break;
            }
            case "u": {
                this.draw = false;
                break;
            }
            case "dn": {
                this.draw = true;
                break;
            }
        }
    }
}