const {Component, xml} = owl


export class Login extends Component {
    setup() {
        this.state = {
            username: '',
            password: ''
        }
        localStorage.removeItem('authTokens')
    }

    async onSubmitForm() {
        const response = await fetch('/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
        if (response.status === 200) {
            var data = await response.json()
            localStorage.setItem('authTokens', JSON.stringify(data))
            window.location.href = '/'
        }
    }
    
    static template = xml`
        <div class="container">
            <h1 style="color:white;">Login</h1>
            <input type="text" name="username" placeholder="Username" t-model="state.username"/>
            <input type="password" name="password" placeholder="Password" t-model="state.password"/>
            <button class="btn btn-primary" t-on-click="onSubmitForm">Submit</button>
        </div>
    `
}
