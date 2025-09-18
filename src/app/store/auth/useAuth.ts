import { apiUrl } from "@/config/config";
import { Auth } from "@/types/auth";
import axios from "axios";
import { create } from "zustand";

export const useAuth = create<Auth>((set, get) => ({
  error: "",
  loading: false,
  setError: (error) => set(() => ({ error: error })),
  setLoading: (loading) => set(() => ({ loading: loading })),

  logIn: async (objUser) => {
    const { setError, setLoading } = get();
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/Account/login`, objUser);
      localStorage.setItem("access_token", data.data);
      window.location.href = "/";
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError("Invalid UserName or Password");
      }
    } finally {
      setLoading(false);
    }
  },

  registration: async (newUser) => {
    const { setError, setLoading, logIn } = get();
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/Account/register`, newUser);
      await logIn(newUser);
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        setError("User Name already exists");
      }
    } finally {
      setLoading(false);
    }
  },
}));
