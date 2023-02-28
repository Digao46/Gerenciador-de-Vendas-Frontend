import React from "react";
import { DatePicker, Space } from "antd";
import { toast } from "react-hot-toast";

import { getSales, delSale, getSale } from "../../../services/api";
import { isAuthenticated } from "../../../services/auth";

import "./Sales.scss";
import { Redirect } from "react-router";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

class Sales extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      sales: [],
      total: 0,
      periodBegin: "",
      periodEnd: "",
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      this.setState({ redirectTo: "/login" });
    }

    this.getAllSales();

    this.props.props.setTitle("Vendas");
  }

  getAllSales = async () => {
    await getSales()
      .then((res) => {
        this.setState({
          sales: res.data.sales,
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

  getSale = (e: any, id: any) => {
    e.preventDefault();

    getSale(id).then((res) => console.log(res.data));
  };

  deleteSale = (e: any, id: any) => {
    e.preventDefault();

    delSale(id)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        } else {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/sales" });
        }
      });
  };

  filterByCustomPeriod = (e: any) => {
    e.preventDefault();

    const begin = this.getDate(this.state.periodBegin);
    const end = this.getDate(this.state.periodEnd);

    begin.setHours(0);
    begin.setMinutes(0);
    end.setHours(23);
    end.setMinutes(59);

    this.getAllSales()
      .then(() => {
        setTimeout(() => {
          const begin = this.getDate(this.state.periodBegin);
          const end = this.getDate(this.state.periodEnd);

          begin.setHours(0);
          begin.setMinutes(0);
          end.setHours(23);
          end.setMinutes(59);

          const salesByPeriod = this.state.sales?.filter(
            (sale: any) =>
              this.getDate(sale.data.createdAt.date) >= this.getDate(begin) &&
              this.getDate(sale.data.createdAt.date) <= this.getDate(end)
          );

          this.setState({
            sales: salesByPeriod.sort((a: any, b: any) => b.id - a.id),
          });
        }, 200);
      })
      .then(() => {
        setTimeout(() => {
          let total = 0;

          for (let i = 0; i < this.state.sales.length; i++) {
            total += this.state.sales[i].data.total;
          }

          this.setState({ total: total });
        }, 800);
      })
      .then(() => {
        toast.success("Filtro Aplicado");
      })
      .catch(() => {
        toast.error("Não foi possível aplicar o filtro!");
      });
  };

  handleChange = (e: any) => {
    this.getAllSales().then(() => {
      if (e) {
        const dateBegin = this.getDate(e[0]._d);
        const dateEnd = this.getDate(e[1]._d);

        this.setState({ periodBegin: dateBegin });
        this.setState({ periodEnd: dateEnd });
      }
      let total = 0;

      for (let i = 0; i < this.state.sales.length; i++) {
        total += this.state.sales[i].data.total;
      }

      this.setState({ total: total });
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

  handleVisualization = () => {
    const span = document.getElementById("total") as HTMLElement;

    const icon = document.getElementById("showTotalSold")! as HTMLElement;

    if (icon.className === "fa fa-eye-slash") {
      icon.className = "fa fa-eye";
      span.innerText = (+this.state.total).toFixed(2).replace(".", ",");
    } else {
      icon.className = "fa fa-eye-slash";
      span.innerText = "-------";
    }
  };

  render() {
    setTimeout(() => {
      let total = 0;

      for (let i = 0; i < this.state.sales.length; i++) {
        total += this.state.sales[i].data.total;
      }

      this.setState({ total: total.toFixed(2) });
    }, 10);

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-10 pt-3">
        <div className="container row d-flex justify-content-center">
          <div className="d-flex col-3 mb-2">
            <div className="cardTotal card justify-content-evenly col-12">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <p className="totalLabel">Valor total das vendas:</p>

                <div className="divValue d-flex justify-content-between mt-3">
                  <span className="moneyLabel d-flex align-items-center me-2">
                    R$
                  </span>

                  {this.state.total >= 0 && (
                    <p
                      id="total"
                      className="totalValue d-flex align-items-center me-2"
                    >
                      -------
                    </p>
                  )}

                  <span id="showOrHidden" className="d-flex align-items-center">
                    <i
                      onClick={this.handleVisualization}
                      id="showTotalSold"
                      className="fa fa-eye-slash"
                    ></i>
                  </span>
                </div>
              </div>

              <div className="filter d-flex flex-column justify-content-center align-items-center">
                <span>Escolha um período:</span>

                <div className="formFilter d-flex justify-content-center align-items-center mt-2">
                  <form
                    className="d-flex flex-column align-items-center"
                    onSubmit={this.filterByCustomPeriod}
                  >
                    <Space direction="vertical" className="mb-1 col-11">
                      <RangePicker
                        format={dateFormat}
                        onChange={this.handleChange}
                      />
                    </Space>
                    <button
                      type="submit"
                      className="btn d-flex justify-content-center align-items-center mb-1"
                    >
                      <i className="fa fa-search" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="mainDiv col-8">
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

                        <span
                          onClick={(e) => this.deleteSale(e, sale.id)}
                          className="trashCan me-2"
                        >
                          <i className="fa fa-trash"></i>
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

                  <div className="products card d-flex justify-content-center col-4">
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
                </div>
              ))
            ) : (
              <section className="container d-flex flex-column align-items-center justify-content-center col-10 pt-3">
                <div className="infoText">
                  <p> Não existem registros para serem exibidos! </p>
                </div>

                <div className="info text-end">
                  <p>Clique aqui</p>

                  <i className="fa fa-arrow-right"></i>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default Sales;
