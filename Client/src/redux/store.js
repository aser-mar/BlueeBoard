import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";

import cartReducer
from "./slices/cartSlice";

import authReducer
from "./slices/authSlice";

import favouritesReducer
from "./slices/favouritesSlice";

import {
  persistReducer,
  persistStore,
} from "redux-persist";

import createWebStorage
from "redux-persist/es/storage/createWebStorage";

const storage =
  createWebStorage("local");

const rootReducer =
  combineReducers({

    cart: cartReducer,

    auth: authReducer,

    favourites:
      favouritesReducer,
  });

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer =
  persistReducer(
    persistConfig,
    rootReducer
  );

export const store =
  configureStore({

    reducer:
      persistedReducer,

    middleware:
      (
        getDefaultMiddleware
      ) =>
        getDefaultMiddleware({
          serializableCheck:
            false,
        }),
  });

export const persistor =
  persistStore(store);