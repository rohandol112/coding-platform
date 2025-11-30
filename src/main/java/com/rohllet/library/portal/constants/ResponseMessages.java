package com.rohllet.library.portal.constants;

/**
 * Interface containing constant response messages for portal operations.
 */
public interface ResponseMessages {

    // Authentication messages
    String USER_REGISTERED_SUCCESSFULLY = "User registered successfully";
    String LOGIN_SUCCESSFUL = "Login successful";
    String INVALID_CREDENTIALS = "Invalid email or password";
    String EMAIL_ALREADY_EXISTS = "Email already exists";
    String TOKEN_EXPIRED = "Token has expired";
    String INVALID_TOKEN = "Invalid token";
    String USER_NOT_FOUND = "User not found";

    // General messages
    String SUCCESS = "Operation completed successfully";
    String FAILURE = "Operation failed";
    String BAD_REQUEST = "Bad request";
    String UNAUTHORIZED = "Unauthorized access";
    String FORBIDDEN = "Access forbidden";
    String NOT_FOUND = "Resource not found";
    String INTERNAL_SERVER_ERROR = "Internal server error";
}