import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getClients } from "../../../services/api";

import "./Clients.scss";
import { isAuthenticated, isAuthorizated } from "../../../services/auth";

class Clients extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      allClients: [],
      clients: [],
      filterKey: "",
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      this.setState({ redirectTo: "/login" });
    }

    this.props.props.setTitle("Clientes");

    this.getAllClients();
  }

  getAllClients = async () => {
    await getClients()
      .then((res) => {
        this.setState({
          clients: res.data.clients,
          allClients: res.data.clients,
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

  getClientId = (clientId: any) => {
    this.props.getClientId(clientId);
  };

  handleChange = (e: any) => {
    this.setState({ clients: this.state.allClients });
    this.setState({ filterKey: e.target.value });
  };

  search = (e: any) => {
    e.preventDefault();

    if (this.state.clients) {
      let clientsFiltered = this.state.clients.filter((client: any) =>
        client.data.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            this.state.filterKey
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      );
      this.setState({ clients: clientsFiltered });
      toast.success("Filtro Aplicado");
    } else {
      toast.error("Não foi possível aplicar o filtro!");
    }
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

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex flex-column align-items-center col-10 pt-3">
        <div className="formArea container d-flex justify-content-center align-items-center mb-3">
          <form onSubmit={this.search} className="d-flex col-8">
            <input
              className="col-8 me-2 ps-4 py-1"
              type="text"
              onChange={this.handleChange}
              placeholder="Pesquisar cliente"
              required
            />

            <button
              type="submit"
              className="btn col-2 d-flex justify-content-center align-items-center"
            >
              <i className="fa fa-search" />
            </button>
          </form>
        </div>

        {this.state.clients.length > 0 ? (
          <table className="table table-hover table-bordered table-striped">
            <thead className="text-center">
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Cliente desde:</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {this.state.clients?.map((client: any) => (
                <tr key={client.id}>
                  <td>{client.data.name}</td>
                  <td>{this.formatDate(client.data.createdAt.date)}</td>

                  {isAuthorizated() ? (
                    <td>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn"
                          onClick={() => {
                            this.getClientId(client.id);
                          }}
                        >
                          <Link to="/editClient">
                            <i className="edit fa fa-edit" />
                          </Link>
                        </button>

                        <button
                          className="btn"
                          onClick={() => {
                            this.getClientId(client.id);
                          }}
                        >
                          <Link to="/deleteClient">
                            <i className="delete fa fa-trash" />
                          </Link>
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="notFound d-flex justify-content-center align-items-center">
            <div className="infoText">
              <p> Não existem registros para serem exibidos! </p>
            </div>

            <div className="info text-end">
              <p>Clique aqui</p>

              <i className="fa fa-arrow-right"></i>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default Clients;
