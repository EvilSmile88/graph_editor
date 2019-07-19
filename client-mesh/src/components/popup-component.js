class PopupComponent {

    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = PopupComponent.markup(this);
        debugger;
    }

    static markup({}) {
        return `
     <div id="mesh__popup" class="mesh__popup mesh__popup-collapsed">
        <div class="mesh__popup-header fluid">
            <h1>mesh.</h1>
        </div>
        <div class="mesh__popup-main">

        </div>
        <div class="mesh__popup-footer">
            <div id="mesh__avatar" class="mesh__avatar"></div>
        </div>
    </div>
    `;
    }

    constructor(container) {
        // The constructor should only contain the boiler plate code for finding or creating the reference.
        if (typeof container.dataset.ref === 'undefined') {
            this.ref = Math.random();
            PopupComponent.refs[this.ref] = this;
            container.dataset.ref = this.ref;
            this.init(container);
        } else {
            // If this element has already been instantiated, use the existing reference.
            return PopupComponent.refs[container.dataset.ref];
        }
    }

}

PopupComponent.refs = {};
