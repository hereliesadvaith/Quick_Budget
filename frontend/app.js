const {Component, mount, xml} = owl;


class App extends Component {
    static template = xml`
        <div class="container">
            <div class="row">
                <div class="col">
                    <h1 class="text-primary fw-bold">QUICK BUDGET</h1>
                </div>
            </div>
        </div>
    `
    setup() {
    }
}

mount(App, document.getElementById("root"))
