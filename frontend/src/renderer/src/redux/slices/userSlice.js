import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: 0,
  full_name: '',
  email: '',
  token: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id
      state.full_name = action.payload.full_name
      state.email = action.payload.email
      state.token = action.payload.token
    },
    removeUser: (state) => {
      state.id = 0
      state.full_name = ''
      state.email = ''
      state.token = ''
    }
  }
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer
