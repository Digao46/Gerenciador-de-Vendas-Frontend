import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getProducts,
  editProductStorage,
  getProduct,
  addSale,
  getClients,
} from "../../../../services/api";

import "./NewSale.scss";

class NewSale extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      products: [],
      clients: [],

      productsInCart: [],

      names: [],
      quantities: [],

      //sale
      id: "",
      name: "",
      price: "",
      storage: "",
      saleStatus: false,
      quantity: 1,
      total: 0,
      idSeller: "",

      //cliente
      idClient: "",

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    getProducts().then((res) => {
      this.setState({
        products: res.data.products.sort(
          (a: any, b: any) => a.data.createdAt.date - b.data.createdAt.date
        ),
      });
    });

    getClients().then((res) =>
      this.setState({
        clients: res.data.clients.sort(
          (a: any, b: any) => a.data.createdAt.date - b.data.createdAt.date
        ),
      })
    );
  }

  handleChange = (e: any) => {
    const inputName = e.target.name;
    let value = e.target.value;

    if (!value) value = 1;

    this.setState({ [inputName]: value });
  };

  handlePaymentChange = (e: any) => {
    let value: any = parseInt(e.target.value);

    value === 1 ? (value = true) : (value = false);

    this.setState({ saleStatus: value });
  };

  cancel = (e: any) => {
    e.preventDefault();

    this.setState({ redirectTo: "/sales" });
  };

  getSelectedProduct = () => {
    let productInput = document.getElementById(
      "productInput"
    ) as HTMLInputElement;
    let name = productInput.value;

    let id: any;

    try {
      id = this.state.products.filter((product: any) =>
        product.data.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .startsWith(
            name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      )[0].id;
    } catch (err) {
      return toast.error("Não foi possível encontrar esse produto!");
    }

    getProduct(id).then((res) => {
      this.setState({
        name: res.data.product.data.name,
        price: res.data.product.data.sellPrice,
        storage: res.data.product.data.storage,
        id: id,
      });
    });
  };

  getSelectedClient = () => {
    let clientInput = document.getElementById(
      "clientInput"
    ) as HTMLInputElement;
    let name = clientInput.value;

    let id: any;

    try {
      id = this.state.clients.filter((client: any) =>
        client.data.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .startsWith(
            name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      )[0].id;
    } catch (err) {
      return toast.error("Não foi possível encontrar esse cliente!");
    }

    this.setState({
      idClient: id,
    });
  };

  addToCart = (e: any) => {
    e.preventDefault();

    let productInput = document.getElementById(
      "productInput"
    ) as HTMLInputElement;

    let quantityInput = document.getElementById("quantity") as HTMLInputElement;

    const product = {
      name: this.state.name,
      price: this.state.price,
      quantity: +this.state.quantity,
      storage: +this.state.storage,
      id: this.state.id,
    };

    const verifyStorage = product.quantity <= product.storage ? true : false;

    const alreadyInCart = this.state.productsInCart.find(
      (e: any) => e.id === product.id
    );

    if (!alreadyInCart && verifyStorage) {
      this.state.productsInCart.push(product);
    } else if (alreadyInCart) {
      alreadyInCart.quantity = +alreadyInCart.quantity + +product.quantity;
    } else {
      return toast("Estoque Insuficiente!", {
        icon: "⚠️",
      });
    }

    productInput.value = "";
    quantityInput.value = "";
    this.setState({
      name: "",
      price: "",
      quantity: 1,
      storage: "",
      id: "",
    });
  };

  removeFromCart = (id: any) => {
    const newCart = this.state.productsInCart.filter(
      (item: any) => item.id !== id
    );

    this.setState({ productsInCart: newCart });
  };

  soldProducts = () => {
    for (let i = 0; i < this.state.productsInCart.length; i++) {
      this.state.names.push(this.state.productsInCart[i].name);
      this.state.quantities.push(this.state.productsInCart[i].quantity);

      const id = this.state.productsInCart[i].id;
      const storage =
        this.state.productsInCart[i].storage -
        this.state.productsInCart[i].quantity;

      editProductStorage(id, { storage });
    }
  };

  addNewSale = (e: any) => {
    e.preventDefault();

    this.soldProducts();

    const products = this.state.names;
    const quantity = this.state.quantities;
    const total = this.state.total;
    const idSeller = JSON.parse(localStorage.getItem("user")!).userId;
    const idClient = this.state.idClient;
    const saleStatus = this.state.saleStatus;

    addSale({ products, quantity, total, idSeller, idClient, saleStatus })
      .then((res) => {
        toast.success(res.data.message);
        this.setState({ redirectTo: "/sales" });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  render() {
    setTimeout(() => {
      const totals = document.querySelectorAll("span.totalValue");
      let totalValue = 0;

      for (let i = 0; i < totals.length; i++) {
        let value: number = parseFloat(totals[i].textContent!);

        totalValue += value;
      }
      this.setState({ total: totalValue });
    }, 10);

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="saleAction d-block d-flex justify-content-center align-items-center">
        <div className="FormArea d-flex justify-content-around align-items-center col-8">
          <div className="d-flex-flex-column justify-content-center align-items-center col-5">
            <div className="my-3">
              <h3 className="text-center"> Nova Venda: </h3>
              <hr className="m-0" />
            </div>

            <form
              onSubmit={this.addToCart}
              className="form d-flex justify-content-center align-items-center col-12"
            >
              <div className="col-10">
                <input
                  type="text"
                  onChange={this.getSelectedProduct}
                  id="productInput"
                  className="selectName col-12 ps-3 pe-3 mb-4"
                  list="productsList"
                  placeholder="Selecione um produto:"
                  required
                />

                <datalist id="productsList">
                  {this.state.products.map((product: any) => (
                    <option
                      id="productId"
                      key={product.id}
                      value={product.data.name}
                    />
                  ))}
                </datalist>

                <div className="d-flex flex-row justify-content-evenly mb-4">
                  <div className="input-group">
                    <span className="holder input-group-text">R$</span>
                    <input
                      type="text"
                      name="sellPrice"
                      className="sellPrice form-control col-12 ps-1"
                      placeholder="Preço"
                      value={(+this.state.price).toFixed(2)}
                      readOnly
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="sellPrice"
                      className="storage form-control col-12 ps-3"
                      placeholder="Estoque"
                      value={this.state.storage}
                      readOnly
                    />
                  </div>
                </div>

                <input
                  onChange={this.handleChange}
                  id="quantity"
                  name="quantity"
                  className="inputQuantity col-12 ps-3 mb-4"
                  placeholder="Quantidade: 1"
                />

                <div className="btns d-flex justify-content-center mb-4">
                  <button type="submit" className="btn btnAdd col-4 me-2">
                    Adicionar
                  </button>
                  <Link to="/sales" className="btn btnCancel col-4 me-2">
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>
          </div>

          <div className="cart col-5">
            <div className="my-3">
              <h3 className="text-center"> Carrinho: </h3>
              <hr className="m-0" />
            </div>

            <ul className="list">
              <div className="itemList">
                {this.state.productsInCart.map((product: any) => (
                  <li key={product.id} className="mb-4 me-2">
                    <div className="item d-flex justify-content-between">
                      <span className="itemName">{product.name}</span>

                      <button
                        onClick={() => {
                          this.removeFromCart(product.id);
                        }}
                        className="btn"
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </div>

                    <div className="itemInfo">
                      <span>Preço = R$</span>
                      {(+product.price).toFixed(2).replace(".", ",")} *{" "}
                      <span className="quantity">
                        Qtd = {product.quantity}{" "}
                      </span>
                    </div>

                    <div className="itemPrices text-end me-1">
                      <span className="subtotal">Subtotal </span>= R$
                      <span className="totalValue">
                        {(product.price * product.quantity).toFixed(2)}
                      </span>
                    </div>
                    <hr />
                  </li>
                ))}
              </div>
              <li className="data d-flex justify-content-between mt-2 col-12">
                <input
                  type="text"
                  onChange={this.getSelectedClient}
                  id="clientInput"
                  className="selectName col-4 ps-3 pe-3 mb-4"
                  list="clientList"
                  placeholder="Cliente:"
                />

                <datalist id="clientList">
                  {this.state.clients.map((client: any) => (
                    <option
                      id="clientId"
                      key={client.id}
                      value={client.data.name}
                    />
                  ))}
                </datalist>

                <select
                  onChange={this.handlePaymentChange}
                  name="payment"
                  id="paymentSelect"
                  className="selectName col-6 ps-3 pe-3 mb-4"
                >
                  <option>Pagamento:</option>
                  <option value={1}>Pago</option>
                  <option value={0}>Comanda</option>
                </select>
              </li>
              <li className="text-end">
                <span className="total">
                  Total = R$
                  {this.state.total.toFixed(2).replace(".", ",")}
                </span>
              </li>
            </ul>

            {this.state.productsInCart.length > 0 && (
              <div className="d-flex justify-content-center">
                <button onClick={this.addNewSale} className="btn btnAdd">
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default NewSale;
