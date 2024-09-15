import { Home } from "./home/home.js"
import { Login } from "./login/login.js"
import { Signup } from "./signup/signup.js"


const {
    Component, mount, xml, useState, useSubEnv, onMounted
} = owl


class Root extends Component {
    // Setup runs just after the component is constructed.
    setup() {
        this.state = useState({
            currentRoute: window.location.pathname,
        })

        // We need to create custom Router for our SPA.
        window.addEventListener(
            'popstate', this.handlePopState.bind(this)
        )

        // Check for logged user
        if (localStorage.getItem('authTokens')) {
            var auth = jwt_decode(JSON.parse(localStorage.getItem('authTokens')).access)
            useSubEnv({
                'user': auth.username,
                'uid': auth.user_id,
                'services': {
                    'orm': this.orm
                }
            })
        }
        
        // Redirect to login or signup
        if (this.state.currentRoute !== '/login/' && !this.env.user) {
            if (this.state.currentRoute !== '/signup/') {
                window.location.pathname = '/login/'
            }
        }

        // Refresh token
        if (localStorage.getItem('authTokens')) {
            setInterval(() => {
                this.updateToken()
            }, 4 * 60 * 1000)
        }
    }

    async updateToken() {
        const response = await fetch('/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'refresh': JSON.parse(localStorage.getItem('authTokens')).refresh
            })
        })
        if (response.status === 200) {
            var data = await response.json()
            data.refresh = JSON.parse(localStorage.getItem('authTokens')).refresh
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            window.location.pathname = '/login/'
        }
    }

    handlePopState() {
        this.state.currentRoute = window.location.pathname
    }

    handleRouteChange(ev) {
        ev.preventDefault()
        window.history.pushState({}, '', ev.target.href)
        this.state.currentRoute = window.location.pathname
    }

    async orm(model) {
        const url = new URL('/api/orm/', window.location.origin)
        const params = {
            model: model
        }
        url.search = new URLSearchParams(params).toString()
        var expenses = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('authTokens')).access                
            }
        })
        return await expenses.json()
    }

    static template = xml`
        <t t-if="state.currentRoute === '/'">
            <Home callback.bind="handleRouteChange"/>
        </t>
        <t t-if="state.currentRoute === '/login/'">
            <Login/>
        </t>
        <t t-if="state.currentRoute === '/signup/'">
            <Signup/>
        </t>
    `

    static components = { Home, Login, Signup }
}

mount(Root, document.getElementById("root"))
