import React from "react";
import { Redirect } from "react-router-dom";
import { deleteUser, getUser } from "../../../../services/api";

import { toast } from "react-hot-toast";

import "./DeleteUser.scss";

class NewUser extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
      username: "",
      isAdmin: "",
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    getUser(this.props.userId).then((res) => {
      this.setState({
        name: res.data.user.data.name,
        username: res.data.user.data.username,
        isAdmin: res.data.user.data.isAdmin,
      });
    });
  }

  delUser = (e: any) => {
    e.preventDefault();

    deleteUser(this.props.userId)
      .then((res) => {
        toast.success(res.data.message);
        this.setState({ redirectTo: "/users" });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  cancel = (e: any) => {
    e.preventDefault();

    this.setState({ redirectTo: "/users" });
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="userAction d-block d-flex justify-content-center align-items-center">
        <div className="FormArea d-flex flex-column justify-content-center align-items-center col-8">
          <div className="my-3">
            <h3> Deseja excluir a Pessoa: </h3>
            <hr className="m-0" />
          </div>

          <form
            onSubmit={this.delUser}
            className="form d-flex justify-content-center align-items-center col-12"
          >
            <div className="col-6">
              <div>
                <input
                  type="text"
                  name="name"
                  className="inputName col-12 ps-3 mb-2"
                  placeholder="Nome"
                  value={this.state.name}
                  readOnly
                />
              </div>
              <div>
                <input
                  type="text"
                  name="username"
                  className="username col-12 ps-3 mb-2"
                  placeholder="Nome de Usuário"
                  value={this.state.username}
                  readOnly
                />
              </div>
              <div>
                <input
                  type="text"
                  name="isAdmin"
                  className="isAdmin col-12 ps-3 mb-2"
                  placeholder="Cargo"
                  value={
                    this.state.isAdmin === true ? "Administrador" : "Vendedor"
                  }
                  readOnly
                />
              </div>
              <div className="btns d-flex justify-content-center mb-4">
                <button type="submit" className="btn btnDel col-4 me-2">
                  Sim, excluir!
                </button>
                <button
                  onClick={this.cancel}
                  className="btn btnCancel col-4 me-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default NewUser;
