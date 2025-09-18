
import { create } from "zustand";
import axiosRequest from "@/utils/axiosRequest"
import { apiUrl } from "@/config/config";

export const useCartStore = create((set, get) => ({
    addProductToCart: async (id) => {
        const { getProductsFromCart } = get()
        try {
            await axiosRequest.post(`${apiUrl}/Cart/add-product-to-cart?id=${id}`)
            getProductsFromCart()
        } catch (error) {
            console.log(error);

        }
    },
    productsFromCart: [],
    getProductsFromCart: async () => {
        try {
            const { data } = await axiosRequest.get(`${apiUrl}/Cart/get-products-from-cart`)
            console.log(data.data[0].productsInCart);

            set({ productsFromCart: data.data[0] })

        } catch (error) {
            console.log((error));

        }
    },
    removeProductFromCart: async (productId) => {
        try {
            await axiosRequest.delete(`${apiUrl}/Cart/delete-product-from-cart?id=${productId}`)
            get().getProductsFromCart()
        } catch (error) {
            console.log(error);
        }
    },
    increaseProductInCart: async (productId) => {
        try {
            await axiosRequest.put(`${apiUrl}/Cart/increase-product-in-cart?id=${productId}`)
            get().getProductsFromCart()
        } catch (error) {
            console.log(error);
        }
    },
    decreaseProductInCart: async (productId) => {
        try {
            await axiosRequest.put(`${apiUrl}/Cart/reduce-product-in-cart?id=${productId}`)
            get().getProductsFromCart()
        } catch (error) {
            console.log(error);
        }
    },
    clearCart: async () => {
        try {
            await axiosRequest.delete(`${apiUrl}/Cart/clear-cart`)
            get().getProductsFromCart()
        } catch (error) {
            console.log(error);
        }
    }
}))