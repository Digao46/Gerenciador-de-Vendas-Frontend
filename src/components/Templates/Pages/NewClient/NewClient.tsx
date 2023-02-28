import React from "react";
import { Redirect } from "react-router-dom";
import { addClient } from "../../../../services/api";

import { toast } from "react-hot-toast";

import "./NewClient.scss";

class NewClient extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
      redirectTo: null,
    };
  }

  handleChange = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.value;
    this.setState({ [inputName]: value });
  };

  addNewClient = (e: any) => {
    e.preventDefault();

    const name = this.state.name;

    addClient({ name })
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
      <div className="clientAddAction d-block d-flex justify-content-center align-items-center">
        <div className="FormArea d-flex flex-column justify-content-center align-items-center col-8">
          <div className="my-3">
            <h3> Adicionar Cliente: </h3>
            <hr className="m-0" />
          </div>
          <form
            onSubmit={this.addNewClient}
            className="form d-flex justify-content-center align-items-center flex-column col-12"
          >
            <div className="col-6 d-flex flex-column justify-content-center align-items-center">
              <input
                onChange={this.handleChange}
                type="text"
                name="name"
                className="inputName col-12 ps-3 mb-2"
                placeholder="Nome"
                required
              />
            </div>

            <div className="btns d-flex justify-content-center mb-4">
              <button type="submit" className="btn btnAdd col-6 me-2">
                Adicionar
              </button>
              <button
                onClick={this.cancel}
                className="btn btnCancel col-6 me-2"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default NewClient;
