import { Table } from "./table/table.js";
const { Component, xml } = owl;

export class Home extends Component {
  static template = xml`
        <div class="container">
            <div class="row">
                <div class="col">
                    <h1 class="text-primary fw-bold">QUICK BUDGET</h1>
                </div>
            </div>
            <div class="row">
                <Table/>
            </div>
        </div>
    `;

  static components = { Table };
}
