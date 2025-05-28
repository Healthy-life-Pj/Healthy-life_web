import { create } from "zustand";

interface UserState {
  username: string;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}

const userAuthStore = create<UserState>((set) => ({
  username: "",
  isAuthenticated: false,
  login: (username) => set({
    username:username,
    isAuthenticated: true,
  }),
  logout: () => set({
    username: "",
    isAuthenticated: false,
  }),
}));
export default userAuthStore;