export function safeErrorMessage(devMessage: string, prodMessage: string): string {
    return process.env.NODE_ENV === 'production' ? prodMessage : devMessage;
}