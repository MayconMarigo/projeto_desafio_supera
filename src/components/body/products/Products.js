import React, { Component } from "react";
import "./Products.css";
import produtos from "../products.json";
import swal from "sweetalert";
import cartIcon from "./cart-icon.svg";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prod: [produtos],
      carrinho: [],
      total: 0,
      subtotal: 0,
      frete: 0,
      openModal: false,
      counter: 0,
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.submitFunction = this.submitFunction.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
  }

  openCart = (e) => {
    this.setState({ openModal: true });

    const car = this.state.carrinho;

    let subTotalValueAdd = 0;
    let freteAdd = 0;

    for (let i = 0; i < car.length; i++) {
      subTotalValueAdd += Object.values(car)[i].preco;
      freteAdd += 10;
    }

    if (subTotalValueAdd > 250) {
      this.setState({
        subtotal: subTotalValueAdd,
        frete: 0,
        total: subTotalValueAdd,
      });
    } else {
      this.setState({
        subtotal: subTotalValueAdd,
        frete: freteAdd,
        total: freteAdd + subTotalValueAdd,
      });
    }
  };

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  removeFromCart(e) {
    const removeTarget = parseInt(e.target.value);
    const car = this.state.carrinho;

    swal({
      text: `Tem certeza que deseja remover do carrinho ?`,
      buttons: ["Manter", "Remover"],
      dangerMode: true,
    }).then((remove) => {
      if (remove) {
        for (let i = 0; i < car.length; i++) {
          if (Object.values(car)[i].id == removeTarget) {
            car.splice(car.indexOf(removeTarget), 1);
          }
        }
        this.openCart();
        const thisCounter = this.state.counter;
        this.setState({ counter: thisCounter - 1 });
      }else{
        swal("Seu carrinho está seguro!")
      }
    });
  }

  orderByName() {
    produtos.sort(function (a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  orderByScore() {
    produtos.sort(function (a, b) {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    });
  }

  orderByMinorPrice() {
    produtos.sort(function (a, b) {
      if (a.price < b.price) return -1;
      if (a.price > b.price) return 1;
      return 0;
    });
  }

  orderByMajorPrice() {
    produtos.sort(function (a, b) {
      if (a.price > b.price) return -1;
      if (a.price < b.price) return 1;
      return 0;
    });
  }

  submitFunction(e) {
    const car = this.state.carrinho;
    e.preventDefault();
    const thisCounter = this.state.counter;

    for (let i = 0; i < car.length; i++) {
      if (car[i].nome == e.target.childNodes[1].innerText) {
        swal({
          title: "Já existe um produto igual no carrinho",
          text: `O produto ${e.target.childNodes[1].innerText} já foi adicionado ao carrinho, deseja adicionar mais uma unidade?`,
          buttons: ["Cancelar", "Adicionar ao carrinho"],
          dangerMode: false,
        }).then((Adicionar) => {
          if (Adicionar) {
            this.setState({
              carrinho: [
                ...this.state.carrinho,
                {
                  nome: e.target.childNodes[1].innerText,
                  preco: parseFloat(
                    e.target.childNodes[3].attributes[2].nodeValue
                  ),
                  id: parseFloat(
                    e.target.childNodes[3].attributes[3].nodeValue
                  ),
                },
              ],
            });
            swal("Produto adicionado com sucesso, boas compras!");
            this.setState({ counter: thisCounter + 1 });
            return;
          } else {
            swal("Produto não adicionado!");
          }
        });
        return;
      }
    }

    swal(
      `Produto ${e.target.childNodes[1].innerText} foi adicionado ao carrinho com sucesso, boas compras!`
    );
    this.setState({ counter: thisCounter + 1 });

    this.setState({
      carrinho: [
        ...this.state.carrinho,
        {
          nome: e.target.childNodes[1].innerText,
          preco: parseFloat(e.target.childNodes[3].attributes[2].nodeValue),
          id: parseFloat(e.target.childNodes[3].attributes[3].nodeValue),
        },
      ],
    });
  }

  handleSelectChange(e) {
    switch (e.target.value) {
      case "name":
        this.setState({ prod: this.orderByName(e) });
        break;
      case "price-major":
        this.setState({ prod: this.orderByMajorPrice(e) });
        break;
      case "price-minor":
        this.setState({ prod: this.orderByMinorPrice(e) });
        break;
      case "score":
        this.setState({ prod: this.orderByScore(e) });
        break;
    }
  }

  render() {
    const { carrinho, counter, total, subtotal, frete } = this.state;
    return (
      <>
        <header>
          <div className="toggle" onClick={this.openCart}>
            <img src={cartIcon}></img>
            <span>
              Seu carrinho: {counter}{" "}
              {counter && counter > 1 ? "Itens" : "Item"}{" "}
            </span>
          </div>
          <Modal open={this.state.openModal} onClose={this.onCloseModal} data-testid="modal">
            <p><strong><u>Seu Carrinho:</u></strong></p>
            {carrinho.map((el) => {
              return (
                <div className="carrinho-card" key={el.id}>
                  <strong>{el.nome}</strong>
                  <br />
                  <span>R$: {el.preco.toFixed(2, 0)}</span>
                  <br />
                  <button value={el.id} onClick={this.removeFromCart}>
                    Remover item
                  </button>
                </div>
              );
            })}
            <p><strong>Subtotal: R$ </strong>{subtotal.toFixed(2)}</p>
            <p><strong>Frete: R$ </strong>{frete}</p>
            <p><strong>Total: R$ </strong>{total.toFixed(2)}</p>
          </Modal>
        </header>

        <div className="select">
          <select onChange={this.handleSelectChange}>
            <option>Ordenar por...</option>
            <option value="name">Ordem alfabética</option>
            <option value="price-minor">Menor preço </option>
            <option value="price-major">Maior Preço</option>
            <option value="score">Mais relevantes</option>
          </select>
        </div>

        <div className="container" >
          {produtos.map((el) => (
            <div className="card" key={el.id} data-testid="card" >
              <form onSubmit={this.submitFunction}>
                <img src={el.image} alt={el.img}></img>
                <h4>
                  <u>{el.name}</u>
                </h4>
                <p>
                  <strong>Popularidade :</strong> {el.score}
                </p>
                <input
                  type="submit"
                  className="buy"
                  value={`Adicionar por R$ ${el.price.toFixed(2, 0)}`}
                  val={el.price}
                  val1={el.id}
                />
              </form>
            </div>
          ))}
        </div>
      </>
    );
  }
}
