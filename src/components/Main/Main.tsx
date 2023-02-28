import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import { isAuthorizated } from "../../services/auth";

import "./Main.scss";

import Home from "../Templates/Home/Home";
import Sales from "../Templates/Sales/Sales";
import SalesOpened from "../Templates/SalesOpened/SalesOpened";
import Storage from "../Templates/Storage/Storage";
import Cash from "../Templates/Cash/Cash";
import Users from "../Templates/Users/Users";
import Clients from "../Templates/Clients/Clients";

import NewProduct from "../Templates/Pages/NewProduct/NewProduct";
import NewClient from "../Templates/Pages/NewClient/NewClient";
import NewSale from "../Templates/Pages/NewSale/NewSale";
import NewUser from "../Templates/Pages/NewUser/NewUser";
import EditProduct from "../Templates/Pages/EditProduct/EditProduct";
import EditUser from "../Templates/Pages/EditUser/EditUser";
import EditClient from "../Templates/Pages/EditClient/EditClient";
import DeleteProduct from "../Templates/Pages/DeleteProduct/DeleteProduct";
import DeleteUser from "../Templates/Pages/DeleteUser/DeleteUser";
import DeleteClient from "../Templates/Pages/DeleteClient/DeleteClient";

class Main extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isActive: true,
      id: 0,
    };
  }

  handleDropdown = () => {
    this.setState({ isActive: !this.state.isActive });

    const btn = document.getElementById("dropdownArea")!;

    if (this.state.isActive) {
      btn.className = "dropdownArea active";
    } else {
      btn.className = "dropdownArea";

      setTimeout(() => {
        btn.className = "dropdownArea deactivate";
      }, 500);
    }
  };

  handleActive = () => {
    this.setState({ isActive: !this.state.isActive });

    const btn = document.getElementById("otherActions")!;

    if (this.state.isActive) {
      btn.className = "otherActions active";
    } else {
      btn.className = "otherActions";
    }
  };

  close = () => {
    this.handleActive();
    this.handleDropdown();
  };

  getId = (id: number) => {
    this.setState({ id: id });
  };

  render() {
    return (
      <main>
        <HashRouter basename="/">
          <Route path="/sales">
            <Sales props={this.props} />
          </Route>

          <Route path="/salesOpened">
            <SalesOpened props={this.props} />
          </Route>

          <Route path="/storage">
            <Storage props={this.props} getProductId={this.getId} />
          </Route>

          <Route path="/clients">
            <Clients props={this.props} getClientId={this.getId} />
          </Route>

          <Route path="/newProduct">
            <NewProduct />
          </Route>

          <Route path="/newClient">
            <NewClient />
          </Route>

          <Route path="/deleteProduct">
            <DeleteProduct productId={this.state.id} />
          </Route>

          <Route path="/deleteClient">
            <DeleteClient clientId={this.state.id} />
          </Route>

          <Route path="/editProduct">
            <EditProduct productId={this.state.id} />
          </Route>

          <Route path="/editClient">
            <EditClient clientId={this.state.id} />
          </Route>

          <Route path="/newSale">
            <NewSale />
          </Route>

          <Route path="/cash">
            <Cash props={this.props} />
          </Route>

          <Route path="/users">
            <Users props={this.props} getUserId={this.getId} />
          </Route>

          <Route path="/newUser">
            <NewUser />
          </Route>

          <Route path="/deleteUser">
            <DeleteUser userId={this.state.id} />
          </Route>

          <Route path="/editUser">
            <EditUser userId={this.state.id} />
          </Route>

          <Route path="/" exact>
            <Home props={this.props} />
          </Route>
        </HashRouter>

        <div>
          <div id="dropdownArea" className="dropdownArea d-none">
            <div className="dropdownMenu">
              <ul className="listMenu d-flex text-start flex-column justify-content-center">
                <li className="newSale d-flex justify-content-start align-items-center my-1">
                  <div className="iconArea d-flex justify-content-center">
                    <i className="fa fa-dollar-sign" />
                  </div>
                  <Link to="/newSale">Iniciar Venda</Link>
                </li>

                {isAuthorizated() && (
                  <li className="newProduct d-flex justify-content-start align-items-center my-1">
                    <div className="iconArea d-flex justify-content-center">
                      <i className="fa fa-warehouse" />
                    </div>
                    <Link to="/newProduct">Add Produto</Link>
                  </li>
                )}

                {isAuthorizated() && (
                  <li className="newProduct d-flex justify-content-start align-items-center my-1">
                    <div className="iconArea d-flex justify-content-center">
                      <i className="fa fa-user-plus" />
                    </div>
                    <Link to="/newUser">Add Funcionário</Link>
                  </li>
                )}

                {isAuthorizated() && (
                  <li className="newProduct d-flex justify-content-start align-items-center my-1">
                    <div className="iconArea d-flex justify-content-center">
                      <i className="fa fa-user" />
                    </div>
                    <Link to="/newClient">Add Cliente</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div
            id="otherActions"
            className="otherActions"
            onClick={this.handleActive}
          >
            <button onClick={this.handleDropdown} className="btn">
              <i id="fa" className="fa fa-plus" />
            </button>
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
