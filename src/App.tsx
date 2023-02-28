import React from "react";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./assets/scss/globals.scss";

import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Nav from "./components/NavMenu/Nav";
import Main from "./components/Main/Main";

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: "Dashboard",
      isActive: false,
      isLogged: false,
    };
  }

  componentDidMount(): void {
    const user = JSON.parse(localStorage.getItem("user")!);

    if (user) {
      this.setState({ isLogged: true });
    }
  }

  handleNav = () => {
    const app = document.querySelector(".interface")!;
    const element = document.querySelector(".navMenu")!;

    if (!this.state.isActive) {
      element.className = "navMenu d-block";
      app.className = "interface menu";
    } else {
      element.className = "navMenu d-none";
      app.className = "interface";
    }
  };

  getActive = (isActive: boolean) => {
    this.setState({ isActive: isActive });
  };

  setTitle = (newTitle: string) => {
    this.setState({ title: newTitle });
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <HashRouter>
        <div className="App">
          <Switch>
            <Route path="/login">
              <Login />

              <Toaster />
            </Route>

            <Route path="/">
              <div className="interface">
                <Header
                  title={this.state.title}
                  getActive={this.getActive}
                  handleNav={this.handleNav}
                />
                <Nav active={this.state.isActive} handleNav={this.handleNav} />
                <Main setTitle={this.setTitle} state={this.state} />

                <Toaster />
              </div>
            </Route>
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
