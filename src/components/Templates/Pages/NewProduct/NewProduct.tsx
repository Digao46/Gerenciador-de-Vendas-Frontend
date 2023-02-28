import React from "react";
import { Redirect } from "react-router-dom";
import { addProduct } from "../../../../services/api";

import { toast } from "react-hot-toast";

import "./NewProduct.scss";

class NewProduct extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
      sellPrice: "",
      costPrice: "",
      quantity: "",
      redirectTo: null,
    };
  }

  handleChange = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.value;

    this.setState({ [inputName]: value });
  };

  addNewProduct = (e: any) => {
    e.preventDefault();

    const name = this.state.name;
    const sellPrice = this.state.sellPrice;
    const costPrice = this.state.costPrice;
    const storage = this.state.quantity;

    addProduct({ name, sellPrice, costPrice, storage })
      .then((res) => {
        toast.success(res.data.message);
        this.setState({ redirectTo: "/storage" });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  cancel = (e: any) => {
    e.preventDefault();

    this.setState({ redirectTo: "/storage" });
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="productAddAction d-block d-flex justify-content-center align-items-center">
        <div className="FormArea d-flex flex-column justify-content-center align-items-center col-8">
          <div className="my-3">
            <h3> Adicionar Produto: </h3>
            <hr className="m-0" />
          </div>

          <form
            onSubmit={this.addNewProduct}
            className="form d-flex justify-content-center align-items-center col-12"
          >
            <div className="col-6">
              <input
                onChange={this.handleChange}
                type="text"
                name="name"
                className="inputName col-12 ps-3 mb-4"
                placeholder="Nome do Produto"
                required
              />

              <div className="d-flex flex-row justify-content-evenly mb-4">
                <div className="input-group">
                  <span className="holder input-group-text">R$</span>
                  <input
                    onChange={this.handleChange}
                    type="text"
                    name="sellPrice"
                    className="sellPrice form-control col-12 ps-1"
                    placeholder="Preço de Venda"
                    required
                  />
                </div>

                <div className="input-group">
                  <span className="holder input-group-text">R$</span>
                  <input
                    onChange={this.handleChange}
                    type="text"
                    name="costPrice"
                    className="costPrice form-control col-12 ps-1"
                    placeholder="Preço de Compra"
                    required
                  />
                </div>
              </div>

              <input
                onChange={this.handleChange}
                name="quantity"
                className="inputQuantity col-12 ps-3 mb-4"
                placeholder="Quantidade"
                required
              />

              <div className="btns d-flex justify-content-center mb-4">
                <button type="submit" className="btn btnAdd col-4 me-2">
                  Adicionar
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

export default NewProduct;
