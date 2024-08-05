import { Home } from "./home/home.js";
import { About } from "./about/about.js";

const {
    Component, mount, xml, useState
} = owl;


class App extends Component {
    setup() {
        // Need to create custom SPA router since OWL removed router properties.
        this.currentRoute = useState({
            value: window.location.hash.slice(1) || '/'
        })
        window.addEventListener("hashchange", () => {
            this.currentRoute.value = window.location.hash.slice(1)
        });
        this.getExpenses()
    }
    async getExpenses() {
        let response = await fetch('http://127.0.0.1:8000/api/expense')
        let data = await response.json()
        console.log(data)
    }
    static template = xml`
        <t t-if="currentRoute.value === '/'">
            <Home/>
        </t>
        <t t-else="">
            <About/>
        </t>
    `
    static components = { Home, About }
}

mount(App, document.getElementById("root"))
