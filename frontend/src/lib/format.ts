import dayjs from "dayjs";

export function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
}

export function formatDate(value: string) {
    return dayjs(value).format("MMM D, YYYY, h:mm A");
}

export function formatTag(value: string) {
    return value.replaceAll("_", " ");
}
