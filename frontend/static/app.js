import { Home } from "./home/home.js"
import { About } from "./about/about.js"


const {
    Component, mount, xml, useState, onWillStart
} = owl


class App extends Component {

    // setup runs just after the component is constructed.
    setup() {
        // Need to create custom SPA router since OWL removed router properties.
        this.state = useState({
            currentRoute: window.location.pathname,
            expenses: []
        })
        // will start hook can be used to perform to load external assets, it will run just before the initial rendering.
        onWillStart(async () => {
            let response = await fetch('/api/expense/')
            this.state.expenses = await response.json()
            console.log(this.state.expenses)
        })
    }

    static template = xml`
        <t t-if="state.currentRoute === '/'">
            <Home/>
        </t>
        <t t-else="">
            <About/>
        </t>
    `

    static components = { Home, About }
}

mount(App, document.getElementById("root"))
