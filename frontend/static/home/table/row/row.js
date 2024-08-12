const {
    Component, xml, useRef, useState, onWillStart, onMounted
} = owl


export class Row extends Component {

    setup() {
        this.state = useState({
            editable: false
        })
    }

    onClickEdit(ev) {
        this.state.editable = true
    }

    onClickDelete(ev) {
        console.log(ev)
    }

    onClickSave(ev) {
        console.log(ev)
    }

    onClickDiscard(ev) {
        this.state.editable = false
    }

    static template = xml`
        <t t-if="state.editable">
            <tr>
                <td><input type="date" t-model="props.expense.date" class="form-control"/></td>
                <td><input type="text" t-model="props.expense.expense" class="form-control"/></td>
                <td><input type="number" t-model="props.expense.price" class="form-control"/></td>
                <td><input type="text" t-model="props.expense.category" class="form-control"/></td>
                <td style="width: 5%;"><i t-att-data-oe_id="props.expense.id" class="fa fa-check text-warning" style="cursor: pointer;" t-on-click="onClickSave"></i></td>
                <td style="width: 5%;"><i t-att-data-oe_id="props.expense.id" class="fa fa-close text-danger" style="cursor: pointer;" t-on-click="onClickDiscard"></i></td>
            </tr>
        </t>
        <t t-else="">
            <t t-if="props.expense.id == 0">
                <tr>
                    <td><input type="date" t-model="props.expense.date" class="form-control"/></td>
                    <td><input type="text" t-model="props.expense.expense" class="form-control"/></td>
                    <td><input type="number" t-model="props.expense.price" class="form-control"/></td>
                    <td><input type="text" t-model="props.expense.category" class="form-control"/></td>
                    <td style="width: 5%;"><i t-att-data-oe_id="props.expense.id" class="fa fa-check text-warning" style="cursor: pointer;" t-on-click="onClickSave"></i></td>
                    <td style="width: 5%;"><i t-att-data-oe_id="props.expense.id" class="fa fa-close text-danger" style="cursor: pointer;" t-on-click="onClickDiscard"></i></td>
                </tr>
            </t>
            <t t-else="">
                <tr>
                    <td t-esc="props.expense.date"/>
                    <td t-esc="props.expense.expense"/>
                    <td t-esc="props.expense.price"/>
                    <td t-esc="props.expense.categroy"/>
                    <td style="width: 5%;"><i t-att-data-oe_id="props.expense.id" class="fa fa-edit text-warning" style="cursor: pointer;" t-on-click="onClickEdit"></i></td>
                    <td style="width: 5%;"><i t-att-data-oe_id="props.expense.id" class="fa fa-trash text-danger" style="cursor: pointer;" t-on-click="onClickDelete"></i></td>
                </tr>
            </t>
        </t>
    `
}
