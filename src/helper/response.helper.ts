export interface ResponseInterface<T> {
    statusCode: number;
    message: string;
    data?: T;
}

export function createResponse<T>(
    statusCode: number,
    message: string,
    data?: T
): ResponseInterface<T> {
    return {
        statusCode,
        message,
        data,
    };
}
