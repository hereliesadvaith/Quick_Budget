import { Row } from "./row/row.js"
const {
    Component, xml, useRef, useState, onWillStart
} = owl


export class Table extends Component {

    setup() {
        this.state = useState({
            expenses: []
        })
        // Will start hook can be used to perform to load external assets, it will run just before the initial rendering.
        onWillStart(async () => {
            await this.loadExpenses()
        })
    }

    async loadExpenses() {
        let response = await fetch('/api/expense/')
        this.state.expenses = await response.json()
    }

    onClickAdd(ev) {
        this.state.expenses.push({
            id: 0,
            date: new Date().toISOString().split('T')[0],
            expense: null,
            price: 0,
            category: null,
        })
    }
    
    static template = xml`
        <div class="row">
            <div class="col-11"/>
            <div class="col-1">
            <button class="btn btn-primary" style="cursor: pointer;" t-on-click="onClickAdd">Add</button>
            </div>
        </div>
        <div class="row">
            <table class="table table-dark table-hover" id="expenseTable">
                <thead class="thead-dark">
                    <tr>
                        <th>Date</th>
                        <th>Expense</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <t t-foreach="state.expenses" t-as="expense" t-key="expense.id">
                        <Row expense="expense"/>
                    </t>
                </tbody>
            </table>
        </div>
    `

    static components = { Row }
}
