package com.adamscanner.resumescanner.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.adamscanner.resumescanner.exception.BedrockApiException;
import com.adamscanner.resumescanner.model.AnalysisResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;




@Service
public class BedrockService {
    
    private final BedrockRuntimeClient bedrockClient;
    private final String modelId;
    private final ObjectMapper objectMapper;

    //initial test prompt
    private static final String PROMPT_TEMPLATE = """
            You are an expert career advisor and resume analyst.
            Compare the following resume against the provided job
            posting and return your analysis.

            RESUME TEXT:
            %s

            JOB POSTING:
            %s

            Return ONLY valid JSON in this exact format with no
            additional text, explanation, or markdown formatting:
            {
                "overallScore": <integer 0-100>,
                "summary": "<2-3 sentence overview>",
                "strengths": ["<strength 1>", "<strength 2>"],
                "missingKeywords": ["<keyword 1>", "<keyword 2>"],
                "suggestions": ["<actionable suggestion 1>"],
                "experienceMatch": "<strong|moderate|weak>",
                "skillsMatch": "<strong|moderate|weak>"
                "justification": "<detailed explanation of the scores and matches>"
            }

            For overallScore, score 80+ means the candidate is a strong fit with minor gaps. Score 50-79 means moderate fit with notable gaps. Score below 50 means significant misalignment.

            For suggestions, Each suggestion should be specific and actionable. Instead of 'Add more technical skills', say 'Add experience with Kubernetes and Docker to your DevOps section to match the job's container orchestration requirement.'

            Return exactly 3-5 strengths, 3-7 missing keywords, and 3-5 suggestions.

            For justification, provide a detailed analysis explaining why the resume received the overall score it did, and explain the reasoning behind the experienceMatch and skillsMatch ratings. Highlight specific areas of alignment and misalignment between the resume and job posting.
            """;

    public BedrockService(BedrockRuntimeClient bedrockClient, String modelId, ObjectMapper objectMapper) {
        this.bedrockClient = bedrockClient;
        this.modelId = modelId;
        this.objectMapper = objectMapper;
        
    }

    public AnalysisResult analyzeResume(String resumeText, String jobPostingText) {

        String prompt = String.format(PROMPT_TEMPLATE, resumeText, jobPostingText);

        String requestBody = buildRequestBody(prompt);
        String responseText = invokeBedrock(requestBody);

        return parseResponse(responseText);
    }

    private String buildRequestBody(String prompt) {
        try {
            Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
            );

            Map<String, Object> body = Map.of(
                "anthropic_version", "bedrock-2023-05-32",
                "max_tokens", 2048,
                "messages", List.of(message)
            );

            return objectMapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to build request body", e);
        }
    }

    private String invokeBedrock(String requestBody) {
        try {
            InvokeModelRequest request = InvokeModelRequest.builder()
                .modelId(modelId)
                .contentType("application/json")
                .body(SdkBytes.fromUtf8String(requestBody))
                .build();

            InvokeModelResponse response = bedrockClient.invokeModel(request);

            String responseBody = response.body().asUtf8String();

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode content = root.get("content");

            if (content != null && content.isArray() && content.size() > 0) {
                return content.get(0).get("text").asText();
            }

            throw new BedrockApiException("Empty response from Bedrock");

        } catch (BedrockApiException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to invoke Bedrock: " + e.getMessage(), e);
        }
    }

    private AnalysisResult parseResponse(String responseText) {
        try {
            
            String cleaned = responseText.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();
            return objectMapper.readValue(cleaned, AnalysisResult.class);

        } catch (JsonProcessingException e) {
            throw new BedrockApiException(
                "Failed to parse AI response. "
                + "Raw response: "
                + responseText.substring(0,
                    Math.min(200, responseText.length())),
                e);

        }
    }
}
