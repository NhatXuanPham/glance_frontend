import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/libs/configApi";
import { UserProfile as CurrentUser } from "@/services/api/user";
interface UserState {
  data: CurrentUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
  initialized: false,
};

export const fetchCurrentUser = createAsyncThunk<CurrentUser>(
  "user/fetchCurrentUser",
  async () => {
    const response = await api.get<CurrentUser>("api/v1/me");
    return response;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load current user";
        state.initialized = true;
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;

