// klasa odpowiedzialna za reagowanie na przyciski na klawiaturze

class Keyboard {
    constructor(listenedElement) {
        this.keyMap = {};
        listenedElement.addEventListener('keydown', event => {
            if (this.keyMap[event.key]) this.keyMap[event.key].active = true
        });
        listenedElement.addEventListener('keyup', event => {
            if (this.keyMap[event.key]) this.keyMap[event.key].active = false
        });
    }

    onKey(name, callback) {
        this.keyMap[name] = {
            active: false,
            callback: callback
        };
    }

    tick(...args) {
        Object.values(this.keyMap).forEach(key => {
            if (key.active) key.callback(...args);
        })
    }
}
