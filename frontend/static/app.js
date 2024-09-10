import { Home } from "./home/home.js"
import { Login } from "./login/login.js"


const {
    Component, mount, xml, useState, useSubEnv
} = owl
const env = {}


class Root extends Component {

    // Setup runs just after the component is constructed.
    setup() {
        useSubEnv({
            'user': 'Advaith'
        })
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
        <t t-if="state.currentRoute === '/login/'">
            <Login/>
        </t>
    `

    static components = { Home, Login }
}

mount(Root, document.getElementById("root"), { env })
