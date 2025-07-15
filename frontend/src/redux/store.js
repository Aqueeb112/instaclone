import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/authSlice.js";
import postSlice from "../redux/postSlice.js";
import socketSlice from "../redux/socketSlice.js";
import chatSlice from "../redux/chatSlice.js";
import rtbSlice from "../redux/rtnSlice.js"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import Post from "@/components/Post.jsx";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice,
    rtn:rtbSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
