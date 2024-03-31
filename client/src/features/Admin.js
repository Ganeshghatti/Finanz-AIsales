import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: {
    email: "",
    token: "",
  },
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    saveadmin: (state, action) => {
      state.admin = action.payload;
    },
    logout:(state,action)=>{
        state.admin=initialState
    }
  },
});

export const { saveadmin,logout } = adminSlice.actions;

export default adminSlice.reducer;
