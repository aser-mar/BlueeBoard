import {
  createSlice,
} from "@reduxjs/toolkit";

const getCartFromStorage =
  () => {

    try {

      const userInfo =
        JSON.parse(
          localStorage.getItem(
            "userInfo"
          )
        );

      const userId =
        userInfo?._id;

      if (!userId) {
        return [];
      }

      const cart =
        localStorage.getItem(
          `cart_${userId}`
        );

      return cart
        ? JSON.parse(cart)
        : [];

    } catch (error) {

      console.log(error);

      return [];
    }
  };

const saveCartToStorage =
  (cartItems) => {

    try {

      const userInfo =
        JSON.parse(
          localStorage.getItem(
            "userInfo"
          )
        );

      const userId =
        userInfo?._id;

      if (!userId) {
        return;
      }

      localStorage.setItem(
        `cart_${userId}`,
        JSON.stringify(
          cartItems
        )
      );

    } catch (error) {

      console.log(error);
    }
  };

const initialState = {
  cartItems:
    getCartFromStorage(),
};

const cartSlice =
  createSlice({
    name: "cart",

    initialState,

    reducers: {

      addToCart:
        (
          state,
          action
        ) => {

          const item =
            action.payload;

          const existingItem =
            state.cartItems.find(
              (product) =>
                product._id ===
                item._id
            );

          if (
            existingItem
          ) {

            if (
              existingItem.quantity <
              item.stock
            ) {

              existingItem.quantity +=
                1;
            }

          } else {

            state.cartItems.push({
              ...item,
              quantity: 1,
            });
          }

          saveCartToStorage(
            state.cartItems
          );
        },

      increaseQuantity:
        (
          state,
          action
        ) => {

          const item =
            state.cartItems.find(
              (product) =>
                product._id ===
                action.payload
            );

          if (
            item &&
            item.quantity <
              item.stock
          ) {

            item.quantity +=
              1;
          }

          saveCartToStorage(
            state.cartItems
          );
        },

      decreaseQuantity:
        (
          state,
          action
        ) => {

          const item =
            state.cartItems.find(
              (product) =>
                product._id ===
                action.payload
            );

          if (
            item &&
            item.quantity > 1
          ) {

            item.quantity -=
              1;
          }

          saveCartToStorage(
            state.cartItems
          );
        },

      removeFromCart:
        (
          state,
          action
        ) => {

          state.cartItems =
            state.cartItems.filter(
              (
                product
              ) =>
                product._id !==
                action.payload
            );

          saveCartToStorage(
            state.cartItems
          );
        },

      clearCart:
        (state) => {

          state.cartItems =
            [];

          saveCartToStorage(
            []
          );
        },

      loadUserCart:
        (state) => {

          state.cartItems =
            getCartFromStorage();
        },
    },
  });

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  loadUserCart,
} = cartSlice.actions;

export default
  cartSlice.reducer;