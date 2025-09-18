import { Product } from "@/types/home";
import axiosRequest from "@/utils/axiosRequest";
import { create } from "zustand";
export interface Brand {
  id: string;
  brandName: string;
}
export interface SubCategory {
  id: number;
  subCategoryName: string;
}

export interface Category {
  id: number;
  categoryImage: string;
  categoryName: string;
  subCategories: SubCategory[];
}

interface ProductStore {
  searchResults: Product[];
  products: Product[];
  pageNumber: number;
  pageSize: number;
  hasMore: boolean;
  isLoadingProducts: boolean;
  isLoadingSearch: boolean;
  isLoadingLoadMore: boolean;
  brands: Brand[];
  categories: Category[],
  subCategories: SubCategory[];
  price: { min: number; max: number };
  setSearchProducts: (search: string) => void;
  getProducts: (
    search: string,
    brand: string,
    category: string,
    subCategory: string,
    minPrice: string,
    maxPrice: string,
    isLoadMore?: boolean
  ) => Promise<void>;
  loadMore: () => void;
  resetPage: () => void;
  getBrands: () => void;
  getCategories: () => void;
  getSubCategories: () => void;
}

export const useProductsStore = create<ProductStore>((set, get) => ({
  searchResults: [],
  products: [],
  pageNumber: 1,
  pageSize: 10,
  hasMore: true,
  isLoadingProducts: false,
  isLoadingSearch: false,
  isLoadingLoadMore: false,
  brands: [],
  categories: [],
  subCategories: [],
  price: { min: 0, max: 10000 },

  getSubCategories: async () => {
    try {
      const response = await axiosRequest.get(
        "/SubCategory/get-sub-category?PageSize=10"
      );
      set({ subCategories: response.status === 204 ? [] : response.data.data });
    } catch (error) {
      console.error(error);
      set({ subCategories: [] });
    }
  },
  getCategories: async () => {
    try {
      const response = await axiosRequest.get(
        "/Category/get-categories?PageSize=10"
      );
      set({ categories: response.status === 204 ? [] : response.data.data });
    } catch (error) {
      console.error(error);
      set({ categories: [] });
    }
  },
  getBrands: async () => {
    try {
      const response = await axiosRequest.get("/Brand/get-brands?PageSize=10");
      set({ brands: response.status === 204 ? [] : response.data.data });
    } catch (error) {
      console.error(error);
      set({ brands: [] });
    }
  },

  setSearchProducts: async (search) => {
    set({ isLoadingSearch: true });
    try {
      const response = await axiosRequest.get(
        `/Product/get-products?ProductName=${search}`
      );
      set({
        searchResults:
          response.status === 204 ? [] : response.data.data.products,
        isLoadingSearch: false,
      });
    } catch (error) {
      console.error(error);
      set({ searchResults: [], isLoadingSearch: false });
    }
  },

  getProducts: async (
    search = "",
    brand = "",
    category = "",
    subCategory = "",
    minPrice = "",
    maxPrice = "",
    isLoadMore = false
  ) => {
    if (!isLoadMore) set({ isLoadingProducts: true });
    if (isLoadMore) set({ isLoadingLoadMore: true });

    const { pageNumber, pageSize, products } = get();

    try {
      const response = await axiosRequest.get(
        `/Product/get-products?ProductName=${search}&MinPrice=${minPrice}&MaxPrice=${maxPrice}&BrandId=${brand}&CategoryId=${category}&SubcategoryId=${subCategory}&PageNumber=${pageNumber}&PageSize=${pageSize}`
      );

      const newProducts =
        response.status === 204 ? [] : response.data.data.products;
       const newPrice =
        response.status === 204 ? [] : response.data.data.minMaxPrice;
      if (newPrice) {
        set({ price: { min: newPrice.minPrice, max: newPrice.maxPrice } });
      }

      set({
        products: isLoadMore ? [...products, ...newProducts] : newProducts,
        hasMore: newProducts.length === pageSize,
      });
    } catch (error) {
      console.error(error);
      set({ products: [], hasMore: false });
    } finally {
      if (!isLoadMore) set({ isLoadingProducts: false });
      if (isLoadMore) set({ isLoadingLoadMore: false });
    }
  },

  loadMore: () => set((state) => ({ pageNumber: state.pageNumber + 1 })),

  resetPage: () => set({ pageNumber: 1, products: [], hasMore: true }),
}));
