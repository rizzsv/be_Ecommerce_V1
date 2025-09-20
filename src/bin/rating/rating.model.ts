import { GenerateRating } from "@prisma/client";

export interface createRating {
    user_id: string;
    product_id: string;
    messageRating: GenerateRating;
    review?: string;
}

export interface updateRating {
    id: string;
    messageRating?: GenerateRating;
    review?: string;
}

export interface getRatingByProduct {
    product_id: string;
}

export interface deleteRating {
    id: string;
}
