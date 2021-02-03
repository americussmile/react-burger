import React, { Component } from "react";
import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/Buildcontrols/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: null,
  };

  componentDidMount() {
    axios
      .get("/ingredients.json")
      .then((response) => {
        this.setState({ ingredients: response.data });
        const newPrice = Object.keys(response.data)
          .map((ingKey) => {
            return INGREDIENT_PRICE[ingKey] * response.data[ingKey];
          })
          .reduce((a, b) => a + b, 0);
        this.setState({ totalPrice: newPrice + 4 });
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  }

  updatePurchaseState(updatedPrice) {
    if (updatedPrice > 4) {
      this.setState({ purchaseable: true });
    } else {
      this.setState({ purchaseable: false });
    }
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredents = { ...this.state.ingredients };
    updatedIngredents[type] = updatedCount;
    const addedPrice = INGREDIENT_PRICE[type];
    const newPrice = this.state.totalPrice + addedPrice;
    this.setState({ ingredients: updatedIngredents, totalPrice: newPrice });
    this.updatePurchaseState(newPrice);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    let newPrice = this.state.totalPrice;
    if (oldCount > 0) {
      const updatedCount = oldCount - 1;
      const updatedIngredents = { ...this.state.ingredients };
      updatedIngredents[type] = updatedCount;
      const addedPrice = INGREDIENT_PRICE[type];
      newPrice = this.state.totalPrice - addedPrice;
      this.setState({ ingredients: updatedIngredents, totalPrice: newPrice });
    }
    this.updatePurchaseState(newPrice);
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Duyen Huynh",
        address: {
          street: "tset",
          zipcode: "00370",
          country: "finland",
        },
        email: "duyen@gmail.com",
      },
      deliverymethod: "fastest",
    };
    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({ loading: false });
        this.setState({ purchasing: false });
      })
      .catch((error) => this.setState({ loading: false }));
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? (
      <p>Ingredients cannot be loaded</p>
    ) : (
      <Spinner />
    );
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            added={this.addIngredientHandler}
            removed={this.removeIngredientHandler}
            amounts={this.state.ingredients}
            disabled={disabledInfo}
            totalPrice={this.state.totalPrice}
            purchaseable={this.state.purchaseable}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          totalPrice={this.state.totalPrice}
          ingredients={this.state.ingredients}
          purchaseCancel={this.purchaseCancelHandler}
          purchaseContinue={this.purchaseContinueHandler}
        />
      );
    }

    if (this.state.loading) {
      orderSummary = this.state.error ? (
        <p>Ingredients cannot be loaded</p>
      ) : (
        <Spinner />
      );
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
