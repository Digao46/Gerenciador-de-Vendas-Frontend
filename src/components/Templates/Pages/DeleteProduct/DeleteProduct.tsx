import React from "react";
import { Redirect } from "react-router-dom";
import { getProduct, deleteProduct } from "../../../../services/api";

import { toast } from "react-hot-toast";

import "./DeleteProduct.scss";

class DeleteProduct extends React.Component<any, any> {
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

  componentDidMount(): void {
    getProduct(this.props.productId).then((res) => {
      this.setState({
        name: res.data.product.data.name,
        sellPrice: (+res.data.product.data.sellPrice)
          .toFixed(2)
          .replace(",", "."),
        costPrice: (+res.data.product.data.costPrice)
          .toFixed(2)
          .replace(",", "."),
        quantity: res.data.product.data.storage,
      });
    });
  }

  handleChange = (e: any) => {
    const inputName = e.target.name;
    const value = e.target.value;

    this.setState({ [inputName]: value });
  };

  delProduct = (e: any) => {
    e.preventDefault();

    deleteProduct(this.props.productId)
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
      <div className="productAction d-block d-flex justify-content-center align-items-center">
        <div className="FormArea d-flex flex-column justify-content-center align-items-center col-8">
          <div className="my-3">
            <h3> Deseja Excluir o Produto? </h3>
            <hr className="m-0" />
          </div>

          <form
            onSubmit={this.delProduct}
            className="form d-flex justify-content-center align-items-center col-12"
          >
            <div className="col-6">
              <input
                onChange={this.handleChange}
                type="text"
                name="name"
                value={this.state.name}
                className="inputName col-12 ps-3 mb-4"
                placeholder="Nome do Produto"
                readOnly
              />

              <div className="d-flex flex-row justify-content-evenly mb-4">
                <div className="input-group">
                  <span className="holder input-group-text">R$</span>
                  <input
                    onChange={this.handleChange}
                    type="text"
                    name="sellPrice"
                    value={this.state.sellPrice}
                    className="sellPrice form-control col-12 ps-1"
                    placeholder="Preço de Venda"
                    readOnly
                  />
                </div>

                <div className="input-group">
                  <span className="holder input-group-text">R$</span>
                  <input
                    onChange={this.handleChange}
                    type="text"
                    name="costPrice"
                    value={this.state.costPrice}
                    className="costPrice form-control col-12 ps-1"
                    placeholder="Preço de Compra"
                    readOnly
                  />
                </div>
              </div>

              <input
                onChange={this.handleChange}
                name="quantity"
                value={this.state.quantity}
                className="inputQuantity col-12 ps-3 mb-4"
                placeholder="Quantidade"
                readOnly
              />

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

export default DeleteProduct;
