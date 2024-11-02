const return_success = (message: string, data?: any) => {
    return {
        statusCode: 200,
        message: message,
        data: data,
    };
};

export { return_success };
