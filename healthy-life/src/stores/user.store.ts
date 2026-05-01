import { create } from "zustand";

interface UserState {
  username: string;
  userNickName: string;
  isAuthenticated: boolean;
  login: (username: string, userNickName: string) => void;
  logout: () => void;
  updateNickName: (userNickName: string) => void;
}

const userAuthStore = create<UserState>((set) => ({
  username: "",
  userNickName: "",
  isAuthenticated: false,
  login: (username, userNickName) => set({
    username,
    userNickName,
    isAuthenticated: true,
  }),
  logout: () => set({
    username: "",
    userNickName: "",
    isAuthenticated: false,
  }),
  updateNickName: (userNickName) => set({ userNickName }),
}));
export default userAuthStore;