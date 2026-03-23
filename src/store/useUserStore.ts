import { create } from "zustand";

interface UserState {
  id: number | null;
  name: string | null;
  email: string | null;

  setUser: (userData: { id: number; name: string; email: string }) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  id: null,
  name: "",
  email: "",
  setUser: (userData) =>
    set({
      id: userData.id,
      name: userData.name,
      email: userData.email,
    }),
  clearUser: () => set({ id: null, name: "", email: "" }),
}));

export default useUserStore;
