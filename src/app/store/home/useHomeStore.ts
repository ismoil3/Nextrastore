import { apiUrl } from "@/config/config";
import { Products } from "@/types/home";
import axios from "axios";
import { create } from "zustand";

export const useHomeStore = create<Products>((set,get) => ({
    products: [],
    getProducts: async () => {
        const {pageSize} = get()
        console.log(pageSize,"salom");
        
        try {
            const { data } = await axios.get(`${apiUrl}/Product/get-products?PageSize=${120}`)
            set({ products: data.data.products })
        } catch (error) {
            console.error(error);

        }
    },
    pageSize: 20,
    setPageSize: () => set((state) => ({ pageSize: state.pageSize + 20 }))
}))