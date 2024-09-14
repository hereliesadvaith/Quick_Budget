const {Component, useState, xml} = owl


export class Signup extends Component {
    setup() {
        this.state = useState({
            username: '',
            fname: '',
            lname: '',
            password: '',
            warning: ''
        })
        localStorage.removeItem('authTokens')
    }

    async onSubmitForm() {
        if (this.state.username && this.state.password && this.state.fname && this.state.lname) {
            const response = await fetch('/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    fname: this.state.fname,
                    lname: this.state.lname,
                })
            })
            if (response.status === 200) {
                const login = await fetch('/api/token/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.state.username,
                        password: this.state.password
                    })
                })
                if (login.status === 200) {
                    var data = await login.json()
                    localStorage.setItem('authTokens', JSON.stringify(data))
                    window.location.href = '/'
                } else {
                    this.state.warning = 'Something went wrong please try again'
                }
            } else {
                this.state.warning = 'Something went wrong please try again'
            }
        } else {
            this.state.warning = 'Please fill all the fields'
        }
    }
    
    static template = xml`
    <div class="row vh-100" style="margin: 0;background: #f2b143;font-family: 'Poppins', sans-serif;">
        <div class="col-8" style="background: #f9fafa;">
            <img class="vh-100" src="https://st2.depositphotos.com/1074452/7714/i/950/depositphotos_77144853-stock-photo-budget-words-represents-budgets-accounting.jpg"/>
        </div>
        <div class="col-4" style="background: #f9fafa;">
            <div class="card" style="margin: 35% 5%;padding: 10%;">
                <h2 style="margin-bottom: 35px;color: #255876;">Sign Up</h2>
                <input t-model="state.fname" type="email" class="form-control mb-3" placeholder="First Name"/>
                <input t-model="state.lname" type="email" class="form-control mb-3" placeholder="Last Name"/>
                <input t-model="state.username" type="email" class="form-control mb-3" placeholder="Email"/>
                <input t-model="state.password" type="password" class="form-control mb-3" placeholder="Password"/>
                <button  t-on-click="onSubmitForm" class="btn btn-primary mb-3" style="color: #f9fafa;background: #255876;">Sign Up</button>
                <p class="mb-3" style="font-size:12px;margin-left:15px;color: #8b8b8b;text-align: center;">Already a member ? <a style="text-decoration: none;color: #255876;" href="/login/">Login</a></p>
                <p t-esc="state.warning" class="text-danger" style="font-size: 12px;text-align: center;"/>
            </div>
        </div>
    </div>
    `
}
