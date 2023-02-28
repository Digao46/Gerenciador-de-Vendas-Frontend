import React from "react";
import { Redirect } from "react-router-dom";
import { getClient, deleteClient } from "../../../../services/api";

import { toast } from "react-hot-toast";

import "./DeleteClient.scss";

class NewUser extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
    };
  }

  componentDidMount(): void {
    getClient(this.props.clientId).then((res) => {
      this.setState({
        name: res.data.client.data.name,
      });
    });
  }

  delClient = (e: any) => {
    e.preventDefault();

    deleteClient(this.props.clientId)
      .then((res) => {
        toast.success(res.data.message);
        this.setState({ redirectTo: "/clients" });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  cancel = (e: any) => {
    e.preventDefault();

    this.setState({ redirectTo: "/clients" });
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="userAction d-block d-flex justify-content-center align-items-center">
        <div className="FormArea d-flex flex-column justify-content-center align-items-center col-8">
          <div className="my-3">
            <h3> Deseja excluir o cliente: </h3>
            <hr className="m-0" />
          </div>

          <form
            onSubmit={this.delClient}
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
