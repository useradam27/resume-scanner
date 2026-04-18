package com.adamscanner.resumescanner.exception;

public class BedrockApiException extends RuntimeException {
    
    public BedrockApiException(String message) {
        super(message);
    }

    public BedrockApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
