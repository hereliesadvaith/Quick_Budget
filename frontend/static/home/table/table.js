import { Row } from "./row/row.js"
const {
    Component, xml, useState, onWillStart
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
        let response = await fetch('/api/expense/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
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

    onClickEdit(ev) {
        this.state.expenses = this.state.expenses.map(
            (expense) => {
                expense['editable'] = false
                return expense
            }
        )
        this.state.expenses.filter(
            expense => expense.id == ev.currentTarget.dataset['oe_id']
        )[0]['editable'] = true
    }

    async onClickDelete(ev) {
        const response = await fetch('/api/expense/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: ev.currentTarget.dataset['oe_id']
            })
        })
        this.state.expenses = await response.json()
    }

    async onClickSave(ev) {
        const data = this.state.expenses.filter(
            expense => expense.id == ev.currentTarget.dataset['oe_id']
        )[0]
        if (ev.currentTarget.dataset['oe_id'] == 0) {
            var method = 'POST'
        } else {
            var method = 'PUT'
        }
        const response = await fetch('/api/expense/', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        this.state.expenses = await response.json()
    }

    onClickDiscard(ev) {
        this.state.expenses.filter(
            expense => expense.id == ev.currentTarget.dataset['oe_id']
        )[0]['editable'] = false
        this.state.expenses = this.state.expenses.filter(expense => expense.id !== 0)
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
                        <Row
                            expense="expense"
                            onClickSave.bind="onClickSave"
                            onClickDiscard.bind="onClickDiscard"
                            onClickEdit.bind="onClickEdit"
                            onClickDelete.bind="onClickDelete"
                        />
                    </t>
                </tbody>
            </table>
        </div>
    `

    static components = { Row }
}
