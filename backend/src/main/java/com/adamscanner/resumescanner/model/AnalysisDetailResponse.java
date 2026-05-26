package com.adamscanner.resumescanner.model;

import lombok.Builder;
import lombok.Data;


// wrap around the analysis result so that AnalysisResult only represents data retrieved from Bedrock,
// and will not mess with any parsing
@Data
@Builder
public class AnalysisDetailResponse {
    private AnalysisResult result;
    private String resumeS3Key;
    private String resumeFileName;
}