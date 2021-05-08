//klasa obiektu 'krawędź'

export class edge {

    // przechowywanie początku, końca i koloru każdej krawędzi
    constructor(start, end, style = '#FA8072') {
        this.start = start;
        this.end = end;
        this.style = style;
    }

    project(perspective) {
        if (this.start.z <= -perspective && this.end.z <= -perspective) {
            return [];
        }
        return [{
            start: {
                x: perspective * this.start.x / Math.max(perspective + this.start.z, 0.01),
                y: perspective * this.start.y / Math.max(perspective + this.start.z, 0.01)
            },
            end: {
                x: perspective * this.end.x / Math.max(perspective + this.end.z, 0.01),
                y: perspective * this.end.y / Math.max(perspective + this.end.z, 0.01)
            }
        }];
    }

    return_move() {
        return [
            this.start,
            this.end
        ];
    }
}