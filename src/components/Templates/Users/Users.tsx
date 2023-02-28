import React from "react";
import toast from "react-hot-toast";
import { Link, Redirect } from "react-router-dom";
import { getUsers } from "../../../services/api";
import { isAuthenticated } from "../../../services/auth";

import "./Users.scss";

let mounted: any;

class Users extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      allUsers: [],
      users: [],
      filterKey: "",
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      this.setState({ redirectTo: "/login" });
    }

    this.props.props.setTitle("Pessoas");

    if (!mounted) {
      this.getAllUsers();
    }

    mounted = !mounted;

    return;
  }

  getAllUsers = async () => {
    await getUsers()
      .then((res) => {
        this.setState({ users: res.data.users, allUsers: res.data.users });
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

  getUserId = (userId: any) => {
    this.props.getUserId(userId);
  };

  handleChange = (e: any) => {
    this.setState({ users: this.state.allUsers });
    this.setState({ filterKey: e.target.value });
  };

  search = (e: any) => {
    e.preventDefault();

    if (this.state.users.length > 0) {
      let usersFiltered = this.state.users.filter((user: any) =>
        user.data.name
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
      this.setState({ users: usersFiltered });
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
              placeholder="Pesquisar funcionário"
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

        {this.state.users.length > 0 ? (
          <table className="table table-hover table-bordered table-striped">
            <thead className="text-center">
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Apelido</th>
                <th scope="col">Cargo</th>
                <th scope="col">Membro desde:</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {this.state.users.map((user: any) => (
                <tr key={user.id}>
                  <td>{user.data.name}</td>
                  <td>{user.data.username}</td>
                  {user.data.isAdmin === true ? (
                    <td>Administrador(a)</td>
                  ) : (
                    <td>Vendedor(a)</td>
                  )}
                  <td>{this.formatDate(user.data.createdAt.date)}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn"
                        onClick={() => {
                          this.getUserId(user.id);
                        }}
                      >
                        <Link to="/editUser">
                          <i className="edit fa fa-edit" />
                        </Link>
                      </button>

                      <button
                        className="btn"
                        onClick={() => {
                          this.getUserId(user.id);
                        }}
                      >
                        <Link to="/deleteUser">
                          <i className="delete fa fa-trash" />
                        </Link>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="notFound d-flex justify-content-center align-items-center">
            <div className="infoText">
              <p> Ainda não existem usuários para serem exibidos! </p>
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

export default Users;
