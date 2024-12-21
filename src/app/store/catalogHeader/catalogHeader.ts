import { apiUrl } from "@/config/config";
import { useCatalogHeader as CatalogHeaderType  } from "@/types/catalogTypes";
import axios from "axios";
import { create } from "zustand";

export const useCatalogHeader = create<CatalogHeaderType >((set)=>({
 catalog: [],
 getCatalog: async ()=>{
  try {
    const {data} = await axios.get(`${apiUrl}/Category/get-categories`)
        set({catalog: data.data})
  } catch (error) {
    console.error(error);
    
  }
 }
}))