import React from "react";
import { Link } from "react-router-dom";
import { isAuthorizated } from "../../services/auth";

import "./Nav.scss";

const Logo = require("../../assets/imgs/logoReal.png");

class Nav extends React.Component<any, any> {
  render() {
    return (
      <aside className="navMenu d-none">
        <div className=" navHeader my-4 d-flex  flex-column align-items-center">
          <img src={Logo} alt="logo" />
        </div>

        <ul className="text-start">
          <li className="my-4 d-flex justify-content-start">
            <div className="iconArea d-flex justify-content-center">
              <i className="fa fa-home" />
            </div>
            <Link to="/" className="ms-2">
              Dashboard
            </Link>
          </li>
          <li className="my-4 d-flex justify-content-start">
            <div className="iconArea d-flex justify-content-center">
              <i className="fa fa-dollar-sign" />
            </div>
            <Link to="/sales" className="ms-2">
              Vendas
            </Link>
          </li>
          <li className="my-4 d-flex justify-content-start">
            <div className="iconArea d-flex justify-content-center">
              <i className="fa fa-box-open" />
            </div>
            <Link to="/salesOpened" className="ms-2">
              Vendas em aberto
            </Link>
          </li>
          <li className="my-4 d-flex justify-content-start">
            <div className="iconArea d-flex justify-content-center">
              <i className="fa fa-warehouse" />
            </div>
            <Link to="/storage" className="ms-2">
              Estoque
            </Link>
          </li>
          {isAuthorizated() && (
            <li className="my-4 d-flex justify-content-start">
              <div className="iconArea d-flex justify-content-center">
                <i className="fa fa-cash-register" />
              </div>

              <Link to="/cash" className="ms-2">
                Caixa
              </Link>
            </li>
          )}

          {isAuthorizated() && (
            <li className="my-4 d-flex justify-content-start">
              <div className="iconArea d-flex justify-content-center">
                <i className="fa fa-circle-user" />
              </div>

              <Link to="/users" className="ms-2">
                Membros
              </Link>
            </li>
          )}

          <li className="my-4 d-flex justify-content-start">
            <div className="iconArea d-flex justify-content-center">
              <i className="fa fa-user" />
            </div>

            <Link to="/clients" className="ms-2">
              Clientes
            </Link>
          </li>
        </ul>
      </aside>
    );
  }
}

export default Nav;
