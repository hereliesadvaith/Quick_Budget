import { Home } from "./home/home.js"


const {
    Component, mount, xml, useState, onWillStart
} = owl


class App extends Component {

    // Setup runs just after the component is constructed.
    setup() {
        this.state = useState({
            currentRoute: window.location.pathname,
        })

        // We need to create custom Router for our SPA.
        window.addEventListener(
            'popstate', this.handlePopState.bind(this)
        )
    }

    handlePopState() {
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
    `

    static components = { Home }
}

mount(App, document.getElementById("root"))
