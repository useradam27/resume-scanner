package com.adamscanner.resumescanner.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) //ignore any extra fields in the JSON response
public class AnalysisResult {
    private int overallScore; // 1-100 score
    private List<String> strengths;
    private List<String> missingKeywords;
    private List<String> suggestions;
    private String experienceMatch;
    private String skillsMatch;
    private String justification;
}
