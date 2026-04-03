import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import savedPostsReducer from "./features/savedPosts/savedPostsSlice";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Mặc định là localStorage

// 1. Kết hợp các reducer (nếu bạn có nhiều slice)
const rootReducer = combineReducers({
  auth: authReducer,
  savedPosts: savedPostsReducer,
  // Thêm các slice khác ở đây
});

// 2. Cấu hình persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "savedPosts"], // LƯU trữ cả 'auth' và 'savedPosts'
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Khởi tạo store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua kiểm tra lỗi tuần tự hóa cho các action của redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;