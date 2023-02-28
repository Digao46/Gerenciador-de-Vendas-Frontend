import React from "react";
import { toast } from "react-hot-toast";

import { getSalesOpened, getClients, updateSale } from "../../../services/api";
import { isAuthenticated } from "../../../services/auth";

import "./SalesOpened.scss";
import { Redirect } from "react-router";

class SalesOpened extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      allSales: [],
      sales: [],
      total: 0,
      clients: [],
      idClient: "",
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      this.setState({ redirectTo: "/login" });
    }

    this.getAllSales();

    getClients().then((res) => this.setState({ clients: res.data.clients }));

    this.props.props.setTitle("Vendas em Aberto");
  }

  getAllSales = async () => {
    await getSalesOpened()
      .then((res) => {
        this.setState({
          sales: res.data.sales,
          allSales: res.data.sales,
        });
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
  };

  getSalesFromSelectedClient = () => {
    this.setState({ sales: this.state.allSales });

    let clientInput = document.getElementById(
      "clientInput"
    ) as HTMLInputElement;
    let name = clientInput.value;

    let id: any;

    try {
      id = this.state.clients.filter((client: any) =>
        client.data.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .startsWith(
            name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      )[0].id;

      this.setState({
        idClient: id,
      });
    } catch (err) {
      return toast.error("Não foi possível encontrar esse cliente!");
    }
  };

  filterSales = () => {
    let salesFiltered: any = [];

    console.log();

    this.state.sales.map((sale: any) => {
      if (
        sale.data.idClient === this.state.idClient &&
        sale.data.saleStatus === false
      ) {
        salesFiltered.push(sale);
      }

      return salesFiltered;
    });

    this.setState({ sales: salesFiltered });
  };

  killAll = (e: any) => {
    e.preventDefault();

    for (let i = 0; i < this.state.sales.length; i++) {
      let sale = this.state.sales[i];

      this.updateSale(e, sale.id);
    }
  };

  updateSale = (e: any, id: any) => {
    e.preventDefault();

    const saleStatus = true;

    updateSale(id, { saleStatus })
      .then((res) => {
        toast.success(res.data.message);
        this.setState({ redirectTo: "/sales" });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  getDate = (date: any) => {
    const newDate = new Date(date);

    return newDate;
  };

  formatDate = (date: any) => {
    const newDate = this.getDate(date);

    const day = newDate.getDate();
    let month: any = newDate.getMonth() + 1;
    const year = newDate.getFullYear();

    if (month < 10) {
      month = `0${month}`;
    }

    const shownDate = `${day}/${month}/${year}`;

    return shownDate;
  };

  formatHour = (date: any) => {
    const newDate = this.getDate(date);

    let hours: any = newDate.getHours();

    let minutes: any = newDate.getMinutes();

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    if (hours < 10) {
      hours = `0${hours}`;
    }

    const shownHours = `${hours}:${minutes}`;

    return shownHours;
  };

  render() {
    setTimeout(() => {
      let total = 0;

      for (let i = 0; i < this.state.sales.length; i++) {
        total += this.state.sales[i].data.total;
      }

      this.setState({ total: total.toFixed(2).replace(".", ",") });
    }, 10);

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-10 pt-3">
        <div className="container flex-column d-flex align-items-center justify-content-center">
          <div className="formArea container d-flex justify-content-center align-items-center mb-2">
            <form className="d-flex col-8 mb-2" onSubmit={this.filterSales}>
              <input
                type="text"
                onChange={this.getSalesFromSelectedClient}
                id="clientInput"
                className="selectName col-8 me-2 ps-4 py-1"
                list="clientList"
                placeholder="Selecione o cliente:"
              />

              <datalist id="clientList">
                {this.state.clients.map((client: any) => (
                  <option
                    id="clientId"
                    key={client.id}
                    value={client.data.name}
                  />
                ))}
              </datalist>

              <button
                type="submit"
                className="btn col-2 d-flex justify-content-center align-items-center"
              >
                <i className="fa fa-search" />
              </button>
            </form>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center col-12">
            <div className="cardTotalOpened card justify-content-evenly col-3 me-1">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <p className="totalLabel">Total:</p>

                <div className="divValue d-flex justify-content-between mt-3">
                  <span className="moneyLabel d-flex align-items-center me-2">
                    R$
                  </span>

                  <p
                    id="total"
                    className="totalValue d-flex align-items-center me-2"
                  >
                    {this.state.total}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-center">
                <button onClick={this.killAll} className="btnFinish col-8">
                  Encerrar as vendas
                </button>
              </div>
            </div>

            <div className="mainDivOpened col-8">
              {this.state.sales.length > 0 ? (
                this.state.sales?.map((sale: any) => (
                  <div
                    className="container d-flex justify-content-center"
                    key={sale.id}
                  >
                    <div className="sale card col-7 d-flex flex-row justify-content-center align-items-center mb-2 me-2">
                      <div className="col-8">
                        <div className="d-flex justify-content-between">
                          <span className="dateLabel me-4">
                            Data: {this.formatDate(sale.data.createdAt.date)}
                          </span>
                          <span className="hourLabel me-4">
                            Hora: {this.formatHour(sale.data.createdAt.date)}
                          </span>
                        </div>

                        <div className="totalValue d-flex justify-content-between align-items-end me-4">
                          <p className="totalLabel mb-1"> Valor total: </p>

                          <div>
                            <span className="moneyLabel">R$</span>
                            <span className="total">
                              {sale.data.total.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="products card d-flex justify-content-center col-4 me-2">
                      <div className="title d-flex justify-content-around">
                        <p className="itemsLabel col-6 "> Items: </p>
                        <p className="itemsLabel col-4"> Qtd: </p>
                      </div>

                      <div className="productsList d-flex flex-column justify-content-center">
                        {sale.data.products.map((product: any, i: any) => (
                          <div
                            key={i}
                            className="productArea d-flex justify-content-center"
                          >
                            {product.length > 14 ? (
                              <p className="productName d-flex justify-content-center align-items-center col-6 text-start">
                                {product[0]}
                                {product[1]}
                                {product[2]}
                                {product[3]}
                                {product[4]}
                                {product[5]}
                                {product[6]}
                                {product[7]}
                                {product[8]}
                                {product[9]}
                                {product[10]}
                                {product[11]}
                                {product[12]}
                                ...
                              </p>
                            ) : (
                              <p className="productName d-flex justify-content-center align-items-center col-6 text-start">
                                {product}
                              </p>
                            )}

                            <p className="d-flex justify-content-center align-items-center col-1">
                              |
                            </p>
                            <p className="soldQuantity d-flex justify-content-center align-items-center col-4">
                              {sale.data.quantity[i]}
                              <span className="unity ms-1">uni.</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="finishAction d-flex align-items-center justify-content-center col-1">
                      <button
                        className="btn"
                        onClick={(e: any) => {
                          this.updateSale(e, sale.id);
                        }}
                      >
                        <i className="fa fa-circle-dollar-to-slot" />
                        <p> Faturar </p>
                        {/* <i className="fa fa-circle-check" /> */}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <section className="container d-flex flex-column align-items-center justify-content-center col-10 pt-3">
                  <div className="infoText">
                    <p> Não existem vendas em aberto para serem exibidas! </p>
                  </div>

                  <div className="info text-end">
                    <p>Clique aqui</p>

                    <i className="fa fa-arrow-right"></i>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default SalesOpened;
