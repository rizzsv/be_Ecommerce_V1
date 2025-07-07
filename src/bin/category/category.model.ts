export interface createCategory {
    name: string;
    slug: string;
}

export interface updateCategory {
    id?: string;
    name?: string;
    slug?: string;
}

export interface getCategory {
    search?: string;
    page: number;
    quantity: number;
    periode: number;
}

export interface deleteCategory {
    id: string;
}

export interface getCategoryBySlug {
    slug: string;
}

export interface getCategoryById {
    id: string;
}