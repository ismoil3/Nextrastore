import CatalogHeader from "@/types/catalogTypes";
import axios from "axios";
import { create } from "zustand";

export const useCatalogHeader = create<CatalogHeader >((set)=>({
 catalog: [],
 getCatalog: async ()=>{
  try {
    const {data} = await axios.get(`https://store-api.softclub.tj/Category/get-categories`)
        set({catalog: data.data})
  } catch (error) {
    console.error(error);
    
  }
 }
}))
