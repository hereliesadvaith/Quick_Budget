const { Component, xml } = owl;

export class Error extends Component {
  static template = xml`
    <div class="container" style="color: white;">
        <h1>404 Page Not Found</h1>
    </div>
    `;
}
