import React from "react";
import { Redirect } from "react-router-dom";
import { getUser, editUser } from "../../../../services/api";

import { toast } from "react-hot-toast";

import "./EditUser.scss";

const defaultImg = require("../../../../assets/imgs/camera.png");

class EditUser extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
      username: "",
      password: "",
      isAdmin: "",
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

  handleChange = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.value;

    this.setState({ [inputName]: value });
  };

  handleAdminChange = (e: any) => {
    let value: any = parseInt(e.target.value);

    value === 1 ? (value = true) : (value = false);

    this.setState({ isAdmin: value });
  };

  handleAvatarChange = (e: any) => {
    const photo = document.getElementById("photoArea") as HTMLImageElement;

    let reader: any = new FileReader();

    reader.onload = () => {
      photo.src = reader.result;
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  handleInputType = () => {
    const input = document.getElementById("password") as HTMLInputElement;

    const icon = document.getElementById("showPasswordIcon")! as HTMLElement;

    if (input.type === "password") {
      input.type = "text";
      icon.className = "showPasswordIcon fa fa-eye-slash";
    } else {
      input.type = "password";
      icon.className = "showPasswordIcon fa fa-eye";
    }
  };

  updateUser = (e: any) => {
    e.preventDefault();

    const id = this.props.userId;
    const name = this.state.name;
    const username = this.state.username;
    const password = this.state.password;
    const isAdmin = this.state.isAdmin;

    editUser(id, { name, username, password, isAdmin })
      .then((res) => {
        toast.success(res.data.message);
        this.setState({ redirectTo: "/users" });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  click = (e: any) => {
    e.preventDefault();

    const inputFile = document.getElementById("avatar") as HTMLInputElement;

    inputFile.click();
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
      <div className="userEditAction d-block d-flex justify-content-center align-items-center">
        <div className="FormArea d-flex flex-column justify-content-center align-items-center col-8">
          <div className="my-3">
            <h3> Editar Usuário: </h3>
            <hr className="m-0" />
          </div>

          <form
            onSubmit={this.updateUser}
            className="form d-flex justify-content-center align-items-center flex-column col-12"
          >
            <input
              style={{ display: "none" }}
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={this.handleAvatarChange}
            />

            <div
              onClick={this.click}
              className="photoArea d-flex justify-content-center align-items-center mb-4"
            >
              <img id="photoArea" src={defaultImg} alt="" />
            </div>

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

              <input
                onChange={this.handleChange}
                type="text"
                name="username"
                className="username col-12 ps-3 mb-1"
                placeholder="Nome de Usuário"
                value={this.state.username}
                required
              />

              <div className="passwordInputArea input-group">
                <input
                  onChange={this.handleChange}
                  type="password"
                  name="password"
                  id="password"
                  className="password form-control col-12 ps-3 mb-1"
                  placeholder="Digite uma senha"
                  value={this.state.password}
                  required
                />

                <span className="input-group-text">
                  <i
                    onClick={this.handleInputType}
                    id="showPasswordIcon"
                    className="showPasswordIcon fa fa-eye"
                  />
                </span>
              </div>

              <select
                className="roleInput col-12 ps-3 mb-2"
                onChange={this.handleAdminChange}
                name="Role"
                id="roleSelect"
                placeholder="Selecione o cargo:"
                value={!this.state.isAdmin ? 0 : 1}
              >
                <option value={1}>Administrador</option>
                <option value={0}>Vendedor</option>
              </select>

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

export default EditUser;
