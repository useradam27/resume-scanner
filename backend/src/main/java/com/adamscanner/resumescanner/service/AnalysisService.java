package com.adamscanner.resumescanner.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.adamscanner.resumescanner.model.AnalysisResult;


@Service
public class AnalysisService {
    
    private final S3Service s3Service;
    private final TextExtractionService textExtractionService;
    private final BedrockService bedrockService;

    public AnalysisService(S3Service s3Service, TextExtractionService textExtractionService, BedrockService bedrockService) {
        this.s3Service = s3Service;
        this.textExtractionService = textExtractionService;
        this.bedrockService = bedrockService;
    }

    public AnalysisResult analyzeResume(MultipartFile file, String jobPostingText) throws IOException {

        // 1. Upload resume to S3
        String userID = "dev-user";
        String contentType = file.getContentType();
        String s3Key = String.format("resumes/%s/%s-%s", userID, UUID.randomUUID(), file.getOriginalFilename());
        s3Service.uploadFile(s3Key, file.getInputStream(), contentType, file.getSize());

        // 2. Download and extract text from resume
        InputStream downloaded = s3Service.downloadFile(s3Key);
        String resumeText = textExtractionService.extractText(downloaded, contentType);


        // 3. Send to Bedrock for analysis
        AnalysisResult result = bedrockService.analyzeResume(resumeText, jobPostingText);
        return result;
    }
}
