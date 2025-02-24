export type Products = {
    products: {
        "id": number | null,
        "productName": string,
        "image": string,
        "color": string,
        "price": number,
        "hasDiscount": boolean,
        "discountPrice": number,
        "quantity": number,
        "productInMyCart": boolean,
        "description": string,
        "productInfoFromCart": {
            "id": number | null,
            "quantity": number | null
        } | null
    }[],
    getProducts: () => Promise<void>,
    pageSize: number,
    setPageSize: ()=> void,
    setProducts: (newProducts: Products["products"]) => void; 
}


