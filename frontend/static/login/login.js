const {Component, xml} = owl


export class Login extends Component {
    setup() {
        localStorage.removeItem('authTokens')
    }

    async onSubmitForm() {
        const response = await fetch('/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: document.querySelector('input[name="username"]').value,
                password: document.querySelector('input[name="password"]').value
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
            <input type="text" name="username" placeholder="Username"/>
            <input type="password" name="password" placeholder="Password"/>
            <button class="btn btn-primary" t-on-click="onSubmitForm">Submit</button>
        </div>
    `
}
