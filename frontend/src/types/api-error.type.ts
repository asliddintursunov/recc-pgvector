export interface ApiError {
    message: string;
    data: {
        message: string;
    }
    status?: number;
    details?: string[];
}