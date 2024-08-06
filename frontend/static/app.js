import { Home } from "./home/home.js"
import { About } from "./about/about.js"


const {
    Component, mount, xml, useState, onWillStart
} = owl


class App extends Component {

    // setup runs just after the component is constructed.
    setup() {
        this.state = useState({
            currentRoute: window.location.pathname,
            expenses: []
        })

        // Will start hook can be used to perform to load external assets, it will run just before the initial rendering.
        onWillStart(async () => {
            let response = await fetch('/api/expense/')
            this.state.expenses = await response.json()
        })

        // We need to create custom Router for our SPA.
        window.addEventListener(
            'popstate', this.handlePopState.bind(this)
        )
        this.handleRouteChange = this.handleRouteChange.bind(this)
    }

    handlePopState(route) {
        this.state.currentRoute = window.location.pathname
    }

    handleRouteChange(ev) {
        ev.preventDefault()
        window.history.pushState({}, '', ev.target.href)
        this.state.currentRoute = window.location.pathname
    }

    static template = xml`
        <t t-if="state.currentRoute === '/'">
            <Home callback.bind="handleRouteChange"/>
        </t>
        <t t-else="">
            <About callback.bind="handleRouteChange"/>
        </t>
    `

    static components = { Home, About }
}

mount(App, document.getElementById("root"))
