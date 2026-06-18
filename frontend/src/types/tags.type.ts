export type ProductTag =
    | "new"
    | "used"
    | "gaming"
    | "electronics"
    | "audio"
    | "wireless"
    | "laptop"
    | "smartphone"
    | "home_appliance"
    | "furniture"
    | "fitness"
    | "books";

export const PRODUCT_TAG_OPTIONS = [
    "new",
    "used",
    "gaming",
    "electronics",
    "audio",
    "wireless",
    "laptop",
    "smartphone",
    "home_appliance",
    "furniture",
    "fitness",
    "books",
] as const satisfies readonly ProductTag[];
