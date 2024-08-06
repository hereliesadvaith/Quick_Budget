const {Component, xml} = owl


export class Home extends Component {

    static template = xml`
        <div class="container">
            <div class="row">
                <div class="col">
                    <h1 class="text-primary fw-bold">QUICK BUDGET</h1>
                </div>
            </div>
            <a href="/about" t-on-click="props.callback">About</a>
        </div>
    `
}
