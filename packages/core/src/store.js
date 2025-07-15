// packages/core/src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Example Slice: User state (extensible for CUJs)
const userSlice = createSlice({
  name: 'user',
  initialState: { role: null, profile: {} },
  reducers: {
    setUser: (state, action) => {
      state.role = action.payload.role;
      state.profile = action.payload.profile;
    },
    // Add reducers for new CUJs (e.g., updateProgress for gamification)
  },
});

export const { setUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    // Add slices dynamically for new modules (e.g., student: studentReducer)
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),  // Add thunk for async (e.g., API calls)
});

export default store; 