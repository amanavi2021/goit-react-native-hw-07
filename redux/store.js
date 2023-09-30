import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authSlice } from "./auth/authSlice";

import thunk from "redux-thunk";
import { applyMiddleware } from "redux";

// import { createStore, applyMiddleware } from "redux";
// import thunkMiddleware from "redux-thunk";
// import { composeWithDevTools } from "@redux-devtools/extension";
// import rootReducer from "./reducer";
// import composeWithDevTools from "@redux-devtools/extension";
// const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));
// import thunkMiddleware from "redux-thunk";
// import rootReducer from "./rootReducer";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
});

const reducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer,

  // middleware: (applyMiddleware) => applyMiddleware(thunk),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // applyMiddleware(thunk),
});

const persistor = persistStore(store);

export default { store, persistor };
// export const store = configureStore({
//   reducer: rootReducer,
//   composedEnhancer,
// });
