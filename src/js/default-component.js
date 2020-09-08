class DefaultComponent {
    element; // HTML element
    constructor() {
        this.render();
        this.initEventListeners();
    }

    initEventListeners(){};

    render(){
        /*
                const element = document.createElement('div');
                element.innerHTML = this.template;
                this.element = element.firElementChild;
                /*this.element = `
                    ... some html template here
                `;*/
    }

    get template(){
        return `<b>Some code</b>`
    }

    remove(){

        this.element.remove();
    }

    destroy(){
        this.remove();
        // additionally needed to remove all listeners
    }
}

const defaultComponent = new DefaultComponent();
const element = document.getElementById('root');

element.append(defaultComponent.element);