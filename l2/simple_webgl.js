import { WebGL } from "./webgl.js";

window.addEventListener("load", () => {
    const points = document.getElementById("points");
    const line_strip = document.getElementById("line_strip");
    const line_loop = document.getElementById("line_loop");
    const lines = document.getElementById("lines");
    const triangle_strip = document.getElementById("triangle_strip");
    const triangle_fan = document.getElementById("triangle_fan");
    const triangles = document.getElementById("triangles");

    const canvas = document.getElementById("webgl_canvas");
    const webGL = new WebGL(canvas);

    const positions = [10, 50, 10, 10, 300, 10, 300, 590, 590, 590, 590, 550];

    points.addEventListener('click', () => {
        webGL.print_active_attr_unif();
        webGL.draw(positions, "POINTS");
    })

    line_strip.addEventListener('click', () => {
        webGL.print_active_attr_unif();
        webGL.draw(positions, "LINE_STRIP");
    })

    line_loop.addEventListener('click', () => {
        webGL.print_active_attr_unif();
        webGL.draw(positions, "LINE_LOOP");
    })

    lines.addEventListener('click', () => {
        webGL.print_active_attr_unif();
        webGL.draw(positions, "LINES");
    })

    triangle_strip.addEventListener('click', () => {
        webGL.print_active_attr_unif();
        webGL.draw(positions, "TRIANGLE_STRIP");
    })

    triangle_fan.addEventListener('click', () => {
        webGL.print_active_attr_unif();
        webGL.draw(positions, "TRIANGLE_FAN");
    })

    triangles.addEventListener('click', () => {
        webGL.print_active_attr_unif();
        webGL.draw(positions, "TRIANGLES");
    })
});