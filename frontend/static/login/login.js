const {Component, useState, xml} = owl


export class Login extends Component {
    setup() {
        this.state = useState({
            username: '',
            password: '',
            warning: ''
        })
        localStorage.removeItem('authTokens')
    }

    async onSubmitForm() {
        if (this.state.username && this.state.password) {
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
            } else {
                this.state.warning = 'Wrong Username or Password'
            }
        } else {
            this.state.warning = 'Wrong Username or Password'
        }
    }
    
    static template = xml`
    <div class="row vh-100" style="margin: 0;background: #f2b143;font-family: 'Poppins', sans-serif;">
        <div class="col-8" style="background: #f9fafa;">
            <img class="vh-100" src="https://st2.depositphotos.com/1074452/7714/i/950/depositphotos_77144853-stock-photo-budget-words-represents-budgets-accounting.jpg"/>
        </div>
        <div class="col-4" style="background: #f9fafa;">
            <div class="card" style="margin: 35% 5%;padding: 10%;">
                <h2 style="margin-bottom: 35px;color: #255876;">Login</h2>
                <input t-model="state.username" type="email" class="form-control mb-3" placeholder="Email"/>
                <input t-model="state.password" type="password" class="form-control mb-3" placeholder="Password"/>
                <button  t-on-click="onSubmitForm" class="btn btn-primary mb-3" style="color: #f9fafa;background: #255876;">Login</button>
                <p class="mb-3" style="font-size:12px;margin-left:15px;color: #8b8b8b;text-align: center;">Not a member ? <a style="text-decoration: none;color: #255876;" href="/signup/">Sign Up</a></p>
                <p t-esc="state.warning" class="text-danger" style="font-size: 12px;text-align: center;"/>
            </div>
        </div>
    </div>
    `
}
