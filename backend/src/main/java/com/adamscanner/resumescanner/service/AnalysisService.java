package com.adamscanner.resumescanner.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.adamscanner.resumescanner.model.AnalysisResult;


@Service
public class AnalysisService {
    
    private final S3Service s3Service;
    private final TextExtractionService textExtractionService;
    private final BedrockService bedrockService;
    private final DynamoDbService dynamoDbService;

    public AnalysisService(S3Service s3Service, TextExtractionService textExtractionService, BedrockService bedrockService, DynamoDbService dynamoDbService) {
        this.s3Service = s3Service;
        this.textExtractionService = textExtractionService;
        this.bedrockService = bedrockService;
        this.dynamoDbService = dynamoDbService;
    }

    public AnalysisResult analyzeResume(MultipartFile file, String jobPostingText) throws IOException {

        System.out.println("=== STEP 1: Upload to S3 ===");
        // 1. Upload resume to S3
        String userId = "dev-user";
        String contentType = file.getContentType();
        String s3Key = String.format("resumes/%s/%s-%s", userId, UUID.randomUUID(), file.getOriginalFilename());
        s3Service.uploadFile(s3Key, file.getInputStream(), contentType, file.getSize());
        System.out.println("=== STEP 1 COMPLETE ===");

        System.out.println("=== STEP 2: Check cache ===");
        Optional<AnalysisResult> cached;
        try {
            cached = dynamoDbService.findCachedResult(
                    userId, s3Key, jobPostingText);
            System.out.println("=== STEP 2 COMPLETE ===");
        } catch (Exception e) {
            System.out.println("=== STEP 2 ERROR: " 
                    + e.getClass().getName() 
                    + " - " + e.getMessage() + " ===");
            cached = Optional.empty();
        }
        System.out.println("=== STEP 2 COMPLETE, cached: "
            + cached.isPresent() + " ===");

        System.out.println("=== STEP 3: Extract text ===");
        // 3. Download and extract text from resume
        InputStream downloaded = s3Service.downloadFile(s3Key);
        String resumeText = textExtractionService.extractText(downloaded, contentType);
        System.out.println("=== STEP 3 COMPLETE ===");


        System.out.println("=== STEP 4: Call Bedrock ===");
        // 4. Send to Bedrock for analysis
        AnalysisResult result = bedrockService.analyzeResume(resumeText, jobPostingText);

        System.out.println("=== STEP 5: Save to DynamoDB ===");
        // 5. Store result in DynamoDB
        dynamoDbService.saveAnalysis(userId, s3Key, file.getOriginalFilename(), jobPostingText, result);
        System.out.println("=== STEP 5 COMPLETE ===");

        return result;
    }
}
