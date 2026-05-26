package com.adamscanner.resumescanner.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.adamscanner.resumescanner.model.AnalysisDetailResponse;
import com.adamscanner.resumescanner.model.AnalysisResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.GetItemResponse;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

@Service
public class DynamoDbService {
    
    private final DynamoDbClient dynamoDbClient;
    private final String tableName;
    private final ObjectMapper objectMapper;

    public DynamoDbService(DynamoDbClient dyanmoDbClient, @Qualifier("dynamoTableName") String dynamoTableName) {
        this.dynamoDbClient = dyanmoDbClient;
        this.tableName = dynamoTableName;
        this.objectMapper = new ObjectMapper();
    }

    //stores analysis result in DynamoDB and returns the generated analysisId
    public String saveAnalysis(String userId, String resumeS3Key, String resumeFileName, String jobPostingText, AnalysisResult result) {
        String analysisId = UUID.randomUUID().toString();
        String timestamp = Instant.now().toString();
        String jobPostingHash = hashText(jobPostingText);

        String resultJson;
        try {
            resultJson = objectMapper.writeValueAsString(result);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize analysis result", e);
        }
        
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("userId", AttributeValue.builder().s(userId).build());
        item.put("analysisId", AttributeValue.builder().s(analysisId).build());
        item.put("timestamp", AttributeValue.builder().s(timestamp).build());
        item.put("resumeS3Key", AttributeValue.builder().s(resumeS3Key).build());
        item.put("jobPostingHash", AttributeValue.builder().s(jobPostingHash).build());
        item.put("overallScore", AttributeValue.builder().n(String.valueOf(result.getOverallScore())).build());
        item.put("resultJson", AttributeValue.builder().s(resultJson).build());

        item.put("jobTitle", AttributeValue.builder()
                .s(result.getJobTitle() != null ? result.getJobTitle() : "Untitled")
                .build());
        item.put("companyName", AttributeValue.builder()
                .s(result.getCompanyName() != null ? result.getCompanyName() : "Unknown")
                .build());
        item.put("resumeFileName", AttributeValue.builder()
                .s(resumeFileName != null ? resumeFileName : "resume.pdf")
                .build());

        PutItemRequest request = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        dynamoDbClient.putItem(request);
        return analysisId;
    }

    // retireve single analysis by ID
    public AnalysisDetailResponse getAnalysis(String userId, String analysisId) {
        Map<String, AttributeValue> key = Map.of(
                "userId", AttributeValue.builder().s(userId).build(),
                "analysisId", AttributeValue.builder().s(analysisId).build()
        );

        GetItemRequest request = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        GetItemResponse response = dynamoDbClient.getItem(request);

        if (!response.hasItem() || response.item().isEmpty()) {
            throw new NoSuchElementException("Analysis not found: " + analysisId);
        }

        try {
            String resultJson = response.item().get("resultJson").s();
            AnalysisResult result = objectMapper.readValue(resultJson, AnalysisResult.class);
            String resumeS3Key = response.item().containsKey("resumeS3Key") ? response.item().get("resumeS3Key").s() : null;
            String resumeFileName = response.item().containsKey("resumeFileName") ? response.item().get("resumeFileName").s() : "resume.pdf";
            return AnalysisDetailResponse.builder()
                    .result(result)
                    .resumeS3Key(resumeS3Key)
                    .resumeFileName(resumeFileName)
                    .build();
                    
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse stored analysis result", e);
        }
    }

    // get user's past history using timestamps
    public List<Map<String, String>> getHistory(String userId) {

        QueryRequest request = QueryRequest.builder()
                .tableName(tableName)
                .indexName("timestamp-index")
                .keyConditionExpression("userId = :uid")
                .expressionAttributeValues(Map.of(":uid", AttributeValue.builder().s(userId).build()
            ))
            .scanIndexForward(false) // newest first
            .limit(20)
            .build();

        QueryResponse response = dynamoDbClient.query(request);

        return response.items().stream().map(item -> {
            Map<String, String> summary = new HashMap<>();
            summary.put("analysisId", item.get("analysisId").s());
            summary.put("timestamp", item.get("timestamp").s());
            summary.put("jobTitle", item.containsKey("jobTitle") ? item.get("jobTitle").s() : "Untitled");
            summary.put("companyName", item.containsKey("companyName") ? item.get("companyName").s() : "Unknown");
            summary.put("resumeFileName", item.containsKey("resumeFileName") ? item.get("resumeFileName").s() : "resume.pdf");
            summary.put("overallScore", item.containsKey("overallScore") ? item.get("overallScore").n() : "0");
            return summary;
        }).collect(Collectors.toList());
    }

    // checks if same resume / job posting combo has been analyzed before
    public Optional<AnalysisResult> findCachedResult(String userId, String resumeS3Key, String jobPostingText) {
        
        String jobPostingHash = hashText(jobPostingText);
        System.out.println("=== Cache check: userId=" + userId
            + ", s3Key=" + resumeS3Key
            + ", hash=" + jobPostingHash + " ===");

        QueryRequest request = QueryRequest.builder()
        .tableName(tableName)
        .keyConditionExpression("userId = :uid")
        .filterExpression("resumeS3Key = :s3key AND jobPostingHash = :hash")
        .expressionAttributeValues(Map.of(
            ":uid", AttributeValue.builder().s(userId).build(),
            ":s3key", AttributeValue.builder().s(resumeS3Key).build(),
            ":hash", AttributeValue.builder().s(jobPostingHash).build()
        ))
        .limit(1)
        .build();

        QueryResponse response = dynamoDbClient.query(request);

        System.out.println("=== Cache query returned "
                + response.items().size() + " items ===");

        if(response.items().isEmpty()) {
            return Optional.empty();
        }


        try {
            String resultJson = response.items().get(0).get("resultJson").s();
            return Optional.of(objectMapper.readValue(resultJson, AnalysisResult.class));
        } catch (JsonProcessingException e) {
            return Optional.empty();
        }

    }

    //MD5 hash helper
    private String hashText(String text) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(text.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 not available", e);
        }
    }
}
