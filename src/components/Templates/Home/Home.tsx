import React from "react";
import toast from "react-hot-toast";
import { Link, Redirect } from "react-router-dom";

import { getProducts, getSales } from "../../../services/api";
import { isAuthenticated, isAuthorizated } from "../../../services/auth";

import "./Home.scss";

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      productsLength: 0,
      salesLength: 0,
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      this.setState({ redirectTo: "/login" });
    }

    this.props.props.setTitle("Dashboard");

    getProducts()
      .then((res) => this.setState({ productsLength: res.data.products }))
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        } else {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/" });
        }
      });

    getSales()
      .then((res) => {
        if (isAuthorizated()) {
          this.setState({ salesLength: res.data.sales });
        } else {
          this.setState({
            salesLength: res.data.sales.filter(
              (sale: any) =>
                sale.idSeller ===
                JSON.parse(localStorage.getItem("user")!).userId
            ),
          });
        }
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        } else {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/" });
        }
      });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-around pt-3">
        <div className="card sales d-flex justify-content-center align-items-center col-3">
          <div className="row w-100 h-80">
            <div className="col-6 d-flex flex-column align-items-start justify-content-around">
              <p>Vendas</p>
              {this.state.salesLength.length > 0 ? (
                <p className="counter d-flex ms-4">
                  {this.state.salesLength.length}
                </p>
              ) : (
                <p className="counter d-flex ms-4">0</p>
              )}
              <button className="btn">
                <Link to="/sales">Ver Mais</Link>
              </button>
            </div>

            <div className="col-6 d-flex justify-content-center align-items-center">
              <i className="fa fa-dollar-sign" />
            </div>
          </div>
        </div>

        <div className="card storage d-flex justify-content-center align-items-center col-3">
          <div className="row w-100 h-80">
            <div className="col-6 d-flex flex-column align-items-start justify-content-around">
              <p>Estoque</p>

              {this.state.productsLength.length > 0 ? (
                <p className="counter d-flex ms-4">
                  {this.state.productsLength.length}
                </p>
              ) : (
                <p className="counter d-flex ms-4">0</p>
              )}
              <button className="btn">
                <Link to="/storage">Ver Mais</Link>
              </button>
            </div>

            <div className="col-6 d-flex justify-content-center align-items-center">
              <i className="fa fa-warehouse" />
            </div>
          </div>
        </div>

        {isAuthorizated() && (
          <div className="card cashRegister d-flex justify-content-center align-items-center col-3">
            <div className="row w-100 h-80">
              <div className="col-6 d-flex flex-column align-items-start justify-content-around">
                <p>Caixa</p>
                <p className="counter d-flex ms-4 transparent">0</p>
                <button className="btn">
                  <Link to="/cash">Ver Mais</Link>
                </button>
              </div>

              <div className="col-6 d-flex justify-content-center align-items-center">
                <i className="fa fa-cash-register" />
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default Home;
