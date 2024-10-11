const return_success = (message: string, data?: any) => {
    return {
        statusCode: 200,
        message: message,
        data: data,
    };
};

const return_error_500 = (message: string) => {
    return {
        statusCode: 500,
        message: message,
    };
};

const return_error_400 = (message: string) => {
    return {
        statusCode: 400,
        message: message,
    };
};

export { return_success, return_error_500, return_error_400 };
