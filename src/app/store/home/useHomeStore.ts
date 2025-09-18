import { apiUrl } from "@/config/config";
import { Products } from "@/types/home";
import { create } from "zustand";
import axiosRequest from "@/utils/axiosRequest"

export const useHomeStore = create<Products>((set, get) => ({
    products: [],
    getProducts: async () => {
        const { pageSize } = get()
        try {
            const { data } = await axiosRequest.get(`${apiUrl}/Product/get-products?PageSize=${pageSize}`)
            set({ products: [...data.data.products] })
        } catch (error) {
            console.error(error);

        }
    },
    pageSize: 12,
    setPageSize: () => set((state) => ({ pageSize: state.pageSize + 10 })),
    setProducts: (newProducts) => set(() => ({ products: newProducts }))
}))