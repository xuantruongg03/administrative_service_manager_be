const return_success = (message: string) => {
    return {
        statusCode: 200,
        message: message,
    };
};

const return_error_500 = (message: string) => {
    return {
        statusCode: 500,
        message: message,
    };
};

export { return_success, return_error_500 };
