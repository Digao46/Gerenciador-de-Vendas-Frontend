import React from "react";
import { Redirect } from "react-router";

import "./Header.scss";

const Logo = require("../../assets/imgs/logo.png");

const localStorageItem = localStorage.getItem("user")!;

class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isDropdownActive: true,
      isMenuActive: true,
      username: "Usuário",
      user: "",
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    const user = JSON.parse(localStorageItem);

    if (user) {
      this.setState({ user: user.username });
    }
  }

  logOut = () => {
    localStorage.removeItem("user");

    this.setState({ redirectTo: "login" });
  };

  handleMenu = () => {
    this.setState({ isMenuActive: !this.state.isMenuActive });

    const element = document.getElementById("menu")!;

    if (this.state.isMenuActive) {
      element.className = "menu active";
    } else {
      element.className = "menu";
    }

    this.props.getActive(this.state.isMenuActive);
    this.props.handleNav();
  };

  render() {
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    return (
      <header className="d-flex align-items-center">
        <div className="container d-flex align-items-center">
          <div className="logoArea container col-6">
            <div className="d-flex justify-content-start align-items-center">
              <button onClick={this.handleMenu} id="menu" className="menu">
                <span className="line"></span>
                <span className="line"></span>
              </button>
              <p className="ms-3">{this.props.title}</p>
            </div>
          </div>

          <div className="navArea container col-6">
            <div className="d-flex me-5 justify-content-end align-items-center">
              <div className="user me-3">
                <p>
                  <span>Seja bem-vindo </span>
                  {this.state.user ? this.state.user : this.state.username}
                </p>
              </div>
              <div className="userImg me-3 d-flex justify-content-center align-items-center">
                <img src={Logo} alt="Imagem Usuário" />
              </div>
              <div className="leave">
                <span onClick={this.logOut}>Sair</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
