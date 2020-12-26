import React, { Component } from "react";
import { connect } from "react-redux";

import Auxillary from "../../hoc/Auxillary/Auxillary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/actions/index";

export class BurgerBuilder extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {...}
  // }

  state = {
    // purchasable: false,
    purchasing: false,
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // alert("You continue!");

    // const queryParams = [];
    // for (let i in this.state.ingredients) {
    //   queryParams.push(
    //     encodeURIComponent(i) +
    //       "=" +
    //       encodeURIComponent(this.state.ingredients[i])
    //   );
    // }
    // queryParams.push("price=" + this.state.totalPrice);
    // const queryString = queryParams.join("&");
    //   this.props.history.push({
    //     pathname: "/checkout",
    //     search: "?" + queryString,
    //   });
    // };
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  render() {
    const diasabledInfo = {
      ...this.props.ings,
    };

    for (let key in diasabledInfo) {
      diasabledInfo[key] = diasabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.props.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    if (this.props.ings) {
      burger = (
        <Auxillary>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemove={this.props.onIngredientRemoved}
            disabled={diasabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
            price={this.props.price}
          />
        </Auxillary>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          price={this.props.price}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }

    return (
      <Auxillary>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Auxillary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (Name) => dispatch(actions.addIngredient(Name)),
    onIngredientRemoved: (Name) => dispatch(actions.removeIngredient(Name)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));

// // addIngredientHandler = (type) => {
// //   const oldCount = this.state.ingredients[type];
// //   const updatedCount = oldCount + 1;
// //   const updatedIngredients = {
// //     ...this.state.ingredients,
// //   };
// //   updatedIngredients[type] = updatedCount;
// //   const priceAddition = INGREDIENTS_PRICES[type];
// //   const oldPrice = this.state.totalPrice;
// //   const newPrice = oldPrice + priceAddition;
// //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
// //   this.updatePurchaseState(updatedIngredients);
// // };

// // removeIngredientHandler = (type) => {
// //   const oldCount = this.state.ingredients[type];
// //   if (oldCount <= 0) {
// //     return;
// //   }
// //   const updatedCount = oldCount - 1;
// //   const updatedIngredients = {
// //     ...this.state.ingredients,
// //   };
// //   updatedIngredients[type] = updatedCount;
// //   const priceDeduction = INGREDIENTS_PRICES[type];
// //   const oldPrice = this.state.totalPrice;
// //   const newPrice = oldPrice - priceDeduction;
// //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
// //   this.updatePurchaseState(updatedIngredients);
// // };
