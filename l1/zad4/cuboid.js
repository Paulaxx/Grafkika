import {edge} from "./edge.js";

export class cuboid {
    constructor(start, end, style = '#FA8072') {

        this.box = {
            // środek prostopadłościanu
            center: {
                x: start.x + (end.x - start.x) / 2,
                y: start.y + (end.y - start.y) / 2,
                z: start.z + (end.z - start.z) / 2
            },
            // odległość od środka prostopadłościanu do każdego z wierzchołków
            radius: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2) + Math.pow(end.z - start.z, 2)) / 2
        };

        //tablica zawierająca wszystkie 12 krawędzi prostopadłościanu
        this.all_edges = [
            new edge({...start}, {...start, x: end.x}, style),
            new edge({...start}, {...start, z: end.z}, style),
            new edge({...start, z: end.z}, {...end, y: start.y}, style),
            new edge({...start, x: end.x}, {...end, z: start.z}, style),
            new edge({...start}, {...start, y: end.y}, style),
            new edge({...start, z: end.z}, {...end, x: start.x}, style),
            new edge({...end}, {...end, z: start.z}, style),
            new edge({...end, y: start.y}, {...end}, style),
            new edge({...end, y: start.y}, {...start, x: end.x}, style),
            new edge({...end}, {...end, x: start.x}, style),
            new edge({...start, y: end.y}, {...end, x: start.x}, style),
            new edge({...start, y: end.y}, {...end, z: start.z}, style)
        ];
        this.style = style;
    }

    return_lines() {
        return this.all_edges;
    }

    return_moves() {
        return this.all_edges.reduce((acc, line) => [...acc, ...line.return_move()], [this.box.center]);
    }

    //zwrócenie najechanego prostopadłościanu - celu
    hit_the_target() {
        return this.box;
    }
}