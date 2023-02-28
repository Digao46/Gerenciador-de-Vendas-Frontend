import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getProducts } from "../../../services/api";

import "./Storage.scss";
import { isAuthenticated, isAuthorizated } from "../../../services/auth";

class Storage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      allProducts: [],
      products: [],
      filterKey: "",
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      this.setState({ redirectTo: "/login" });
    }

    this.props.props.setTitle("Estoque");

    this.getAllProducts();
  }

  getAllProducts = async () => {
    await getProducts()
      .then((res) => {
        this.setState({
          products: res.data.products,
          allProducts: res.data.products,
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

  getProductId = (productId: any) => {
    this.props.getProductId(productId);
  };

  handleChange = (e: any) => {
    this.setState({ products: this.state.allProducts });
    this.setState({ filterKey: e.target.value });
  };

  search = (e: any) => {
    e.preventDefault();
    if (this.state.products) {
      let productsFiltered = this.state.products.filter((product: any) =>
        product.data.name
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
      this.setState({ products: productsFiltered });
      toast.success("Filtro Aplicado");
    } else {
      toast.error("Não foi possível aplicar o filtro!");
    }
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
              placeholder="Pesquisar produto"
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

        {this.state.products.length > 0 ? (
          <table className="table table-hover table-bordered table-striped">
            <thead className="text-center">
              <tr>
                <th scope="col">Produto</th>
                <th scope="col">Estoque</th>
                <th scope="col">Preço de Venda</th>
                {isAuthorizated() ? <th scope="col">Preço de Custo</th> : null}
                {isAuthorizated() ? <th scope="col">Lucro Unidade</th> : null}
                {isAuthorizated() ? <th scope="col">Ações</th> : null}
              </tr>
            </thead>

            <tbody className="text-center">
              {this.state.products?.map((product: any) => (
                <tr key={product.id}>
                  <td>{product.data.name}</td>

                  {product.data.storage < 50 ? (
                    <td className="text-danger">{product.data.storage} uni</td>
                  ) : product.storage < 100 ? (
                    <td className="text-warning">{product.data.storage} uni</td>
                  ) : (
                    <td>{product.data.storage} uni</td>
                  )}

                  <td>
                    R$
                    <span>
                      {(+product.data.sellPrice).toFixed(2).replace(".", ",")}
                    </span>
                  </td>

                  {isAuthorizated() && product.data.costPrice ? (
                    <td>
                      R$
                      <span>
                        {(+product.data.costPrice).toFixed(2).replace(".", ",")}
                      </span>
                    </td>
                  ) : null}

                  {isAuthorizated() && product.data.costPrice ? (
                    <td>
                      R$
                      {(product.data.sellPrice - product.data.costPrice)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                  ) : null}

                  {isAuthorizated() && product.data.costPrice ? (
                    <td>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn"
                          onClick={() => {
                            this.getProductId(product.id);
                          }}
                        >
                          <Link to="/editProduct">
                            <i className="edit fa fa-edit" />
                          </Link>
                        </button>

                        <button
                          className="btn"
                          onClick={() => {
                            this.getProductId(product.id);
                          }}
                        >
                          <Link to="/deleteProduct">
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

export default Storage;
