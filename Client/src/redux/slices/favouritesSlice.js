import { createSlice } from "@reduxjs/toolkit";

const getUserId = () => {
  try {

    const persistRoot = JSON.parse(
      localStorage.getItem("persist:root")
    );

    const authData = JSON.parse(
      persistRoot?.auth || "{}"
    );

    return authData?.userInfo?._id || null;

  } catch {

    return null;
  }
};

const getFavouritesFromStorage = () => {

  try {

    const userId = getUserId();

    if (!userId) {
      return [];
    }

    const favourites =
      localStorage.getItem(
        `favourites_${userId}`
      );

    return favourites
      ? JSON.parse(favourites)
      : [];

  } catch {

    return [];
  }
};

const saveFavouritesToStorage = (
  favouritesItems
) => {

  try {

    const userId = getUserId();

    if (!userId) {
      return;
    }

    localStorage.setItem(
      `favourites_${userId}`,
      JSON.stringify(
        favouritesItems
      )
    );

  } catch {

    return;
  }
};

const initialState = {
  favouritesItems:
    getFavouritesFromStorage(),
};

const favouritesSlice =
  createSlice({

    name: "favourites",

    initialState,

    reducers: {

      addToFavourites:
        (state, action) => {

          const exists =
            state.favouritesItems.find(
              (item) =>
                item._id ===
                action.payload._id
            );

          if (!exists) {

            state.favouritesItems.push(
              action.payload
            );

            saveFavouritesToStorage(
              state.favouritesItems
            );
          }
        },

      removeFromFavourites:
        (state, action) => {

          state.favouritesItems =
            state.favouritesItems.filter(
              (item) =>
                item._id !==
                action.payload
            );

          saveFavouritesToStorage(
            state.favouritesItems
          );
        },

      loadUserFavourites:
        (state) => {

          state.favouritesItems =
            getFavouritesFromStorage();
        },

      clearFavourites:
        (state) => {

          state.favouritesItems = [];

          saveFavouritesToStorage([]);
        },
    },
  });

export const {
  addToFavourites,
  removeFromFavourites,
  loadUserFavourites,
  clearFavourites,
} = favouritesSlice.actions;

export default
favouritesSlice.reducer;