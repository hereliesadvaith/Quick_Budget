import { Error } from "./error/error.js";
import { Home } from "./home/home.js";
import { Login } from "./login/login.js";
import { Signup } from "./signup/signup.js";

const { Component, mount, useState, useSubEnv, xml } = owl;

class Root extends Component {
  setup() {
    // useState hook to re render page based on current route
    this.state = useState({
      currentRoute: window.location.pathname.replace(/^\/[a-z]{2}/, ''),
    });
    // We need to create custom Router for our SPA
    window.addEventListener("popstate", this.handlePopState.bind(this));
    // Check for logged user
    if (localStorage.getItem("authTokens")) {
      this.updateToken();
      var auth = jwt_decode(
        JSON.parse(localStorage.getItem("authTokens")).access
      );
      // Save values to environment.
      useSubEnv({
        user: auth.username,
        uid: auth.user_id,
        services: {
          orm: this.orm,
          _t: gettext,
        },
      });
    }
    // Redirect to login or signup
    if (this.state.currentRoute !== "/login/" && !this.env.user) {
      if (this.state.currentRoute !== "/signup/") {
        window.location.pathname = "/login/";
      }
    }
    // Refresh token
    if (localStorage.getItem("authTokens")) {
      setInterval(() => {
        this.updateToken();
      }, 4 * 60 * 1000);
    }
  }

  async updateToken() {
    const response = await fetch("/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: JSON.parse(localStorage.getItem("authTokens")).refresh,
      }),
    });
    if (response.status === 200) {
      var data = await response.json();
      data.refresh = JSON.parse(localStorage.getItem("authTokens")).refresh;
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      window.location.pathname = "/login/";
    }
  }

  handlePopState() {
    this.state.currentRoute = window.location.pathname;
  }

  handleRouteChange(ev) {
    ev.preventDefault();
    window.history.pushState({}, "", ev.target.href);
    this.state.currentRoute = window.location.pathname;
  }

  async orm(url, method, data) {
    if (method === "GET") {
      var records = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
      });
      return await records.json();
    } else if (method == "POST") {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
        body: JSON.stringify(data),
      });
    } else if (method == "PUT") {
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
        body: JSON.stringify(data),
      });
    } else if (method == "DELETE") {
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
      });
    }
  }

  static template = xml`
        <t t-if="state.currentRoute === '/'">
            <Home callback.bind="handleRouteChange"/>
        </t>
        <t t-elif="state.currentRoute === '/login/'">
            <Login/>
        </t>
        <t t-elif="state.currentRoute === '/signup/'">
            <Signup/>
        </t>
        <t t-else="">
            <Error/>
        </t>
    `;

  static components = { Error, Home, Login, Signup };
}

mount(Root, document.getElementById("root"));
