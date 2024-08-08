const {
    Component, xml, onWillStart, useState
} = owl


export class Table extends Component {

    setup() {
        this.state = useState({
            expenses: [],
            edit_line: 0
        })
        // Will start hook can be used to perform to load external assets, it will run just before the initial rendering.
        onWillStart(async () => {
            this.loadExpenses()
        })
    }

    async loadExpenses() {
        let response = await fetch('/api/expense/')
        this.state.expenses = await response.json()  
    }

    onClickEdit(ev) {
        this.state.edit_line = ev.currentTarget.dataset['oe_id']
    }

    onClickDelete(ev) {
        console.log(ev)
    }
    
    static template = xml`
        <div class="row">
            <div class="col-11"/>
            <div class="col-1">
            <button class="btn btn-primary">Add</button>
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
                        <t t-if="expense.id == state.edit_line">
                            <td><input type="date" t-model="expense.date" class="form-control"/></td>
                            <td><input type="text" t-model="expense.expense" class="form-control"/></td>
                            <td><input type="number" t-model="expense.price" class="form-control"/></td>
                            <td><input type="text" t-model="expense.category" class="form-control"/></td>
                            <td style="width: 5%;"><i class="fa fa-check text-warning" style="cursor: pointer;" t-on-click="onClickEdit"></i></td>
                            <td style="width: 5%;"><i class="fa fa-trash text-danger" style="cursor: pointer;" t-on-click="onClickDelete"></i></td>
                        </t>
                        <t t-else="">
                            <tr>
                                <td t-esc="expense.date"/>
                                <td t-esc="expense.expense"/>
                                <td t-esc="expense.price"/>
                                <td t-esc="expense.categroy"/>
                                <td style="width: 5%;"><i t-att-data-oe_id="expense.id" class="fa fa-edit text-warning" style="cursor: pointer;" t-on-click="onClickEdit"></i></td>
                                <td style="width: 5%;"><i t-att-data-oe_id="expense.id" class="fa fa-trash text-danger" style="cursor: pointer;" t-on-click="onClickDelete"></i></td>
                            </tr>
                        </t>
                    </t>
                </tbody>
            </table>
        </div>
    `
}
