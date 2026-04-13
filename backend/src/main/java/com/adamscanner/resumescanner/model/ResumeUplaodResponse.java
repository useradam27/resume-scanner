package com.adamscanner.resumescanner.model;

import lombok.Builder;
import lombok.Data;

//Defines structure of our json response
@Data
@Builder
public class ResumeUplaodResponse {
    private String message;
    private String s3Key;
    private String fileName;
    private long fileSize;
    private String textPreview;
    private int textLength;
}
