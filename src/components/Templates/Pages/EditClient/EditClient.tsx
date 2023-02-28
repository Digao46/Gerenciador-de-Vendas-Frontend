import React from "react";
import { Redirect } from "react-router-dom";
import { editClient, getClient } from "../../../../services/api";

import { toast } from "react-hot-toast";

import "./EditClient.scss";

class EditClient extends React.Component<any, any> {
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

  handleChange = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.value;

    this.setState({ [inputName]: value });
  };

  updateClient = (e: any) => {
    e.preventDefault();

    const id = this.props.clientId;
    const name = this.state.name;

    editClient(id, { name })
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
      <div className="clientEditAction d-block d-flex justify-content-center align-items-center">
        <div className="FormArea d-flex flex-column justify-content-center align-items-center col-8">
          <div className="my-3">
            <h3> Editar Cliente: </h3>
            <hr className="m-0" />
          </div>

          <form
            onSubmit={this.updateClient}
            className="form d-flex justify-content-center align-items-center flex-column col-12"
          >
            <div className="col-6">
              <input
                onChange={this.handleChange}
                type="text"
                name="name"
                className="name col-12 ps-3 mb-1"
                placeholder="Nome"
                value={this.state.name}
                required
              />

              <div className="btns d-flex justify-content-center mb-4">
                <button type="submit" className="btn btnAdd col-4 me-2">
                  Confirmar
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

export default EditClient;
