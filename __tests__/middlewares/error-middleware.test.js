const errorHandler = require('../../src/middlewares/error-middleware');

describe('[MIDDLEWARE] Error handler', () => {
    let error = {
        name: "error",
        statusCode: 500,
        status: 1,
        message: "string",
        error: "string"
    };
    let nextFunction = jest.fn();
    let mockRequest = {};
    let mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    it('Should handle error when status is 500', () => {

        errorHandler(
            error,
            mockRequest,
            mockResponse, 
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(nextFunction).not.toHaveBeenCalled();
    });
});