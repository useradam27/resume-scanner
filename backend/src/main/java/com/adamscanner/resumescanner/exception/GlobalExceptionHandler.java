package com.adamscanner.resumescanner.exception;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
@RestController
public class GlobalExceptionHandler {
    
    //handles bad files, 400 bad request
    @ExceptionHandler(FileValidationException.class)
    public ResponseEntity<Map<String, String>> handleFileValidation(FileValidationException e) {
        Map<String, String> error = Map.of("error", "File validation error", "message", e.getMessage());
        
        return ResponseEntity.badRequest().body(error);
    }

    //handles files that exceed max size, 413
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxSize(MaxUploadSizeExceededException e) {
        Map<String, String> error = Map.of("error", "File too Large", "message", "File size exceeds the 10MB limit");

        return ResponseEntity.status(413).body(error);
    }

    //catche all handler, 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception e) {
        Map<String, String> error = Map.of("error", "Internal Server Error", "message", "An unexpected error occurred");

        return ResponseEntity.status(500).body(error);
    }

    @ExceptionHandler(BedrockApiException.class)
    public ResponseEntity<Map<String, String>> handleBedrockError(BedrockApiException e) {
        Map<String, String> error = Map.of("error", "AI Analysis Errorß", "message", e.getMessage());

        return ResponseEntity.status(502).body(error);
    }
}
