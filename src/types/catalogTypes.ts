export default interface CatalogHeader {
    catalog: {
        id: number;
        categoryImage: string;
        subCategories: {
            id: number;
            subCategoryName: string;
        }[];
        categoryName: string;
    }[];
    getCatalog: ()=> Promise<void>
}

export type Subcategories = {
    id: number | null,
        categoryImage: string  | null,
        subCategories: {
            id: number,
            subCategoryName: string | null,
        }[];
        categoryName: string | null;
} | null | undefined