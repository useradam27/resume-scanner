package com.adamscanner.resumescanner.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.adamscanner.resumescanner.exception.FileValidationException;
import com.adamscanner.resumescanner.model.AnalysisResult;
import com.adamscanner.resumescanner.model.ResumeUploadResponse;
import com.adamscanner.resumescanner.service.AnalysisService;
import com.adamscanner.resumescanner.service.S3Service;
import com.adamscanner.resumescanner.service.TextExtractionService;




@RestController
@RequestMapping("/api")
public class ResumeController {
    
    private final S3Service s3Service;
    private final TextExtractionService textExtractionService;
    private final AnalysisService analysisService;

    public ResumeController(S3Service s3Service, TextExtractionService textExtractionService, AnalysisService analysisService) {
        this.s3Service = s3Service;
        this.textExtractionService = textExtractionService;
        this.analysisService = analysisService;
    }

    private static final Set<String> ALLOWED_TYPES = Set.of(
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    @PostMapping("/upload")
    public ResponseEntity<ResumeUploadResponse> uploadResume(@RequestParam("file") MultipartFile file) throws IOException {

        //file validation
        if (file.isEmpty()) {
            throw new FileValidationException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new FileValidationException("Invalid file type. Only PDF and DOCX are accepted.");
        }

        String userID = "dev-user"; // In a real app, get this from auth context
        String key = String.format("resumes/%s/%s-%s",
            userID,
            UUID.randomUUID(),
            file.getOriginalFilename());
 
        //store in s3
        s3Service.uploadFile(key, file.getInputStream(), contentType, file.getSize());

        //download back and extract the text
        InputStream downloaded = s3Service.downloadFile(key);
        String extractedText = textExtractionService.extractText(downloaded, contentType);

        String preview = extractedText.length() > 500 ? extractedText.substring(0, 500) + "..." : extractedText;

        ResumeUploadResponse response = ResumeUploadResponse.builder()
            .message("File uploaded and processed successfully")
            .s3Key(key)
            .fileName(file.getOriginalFilename())
            .fileSize(file.getSize())
            .textPreview(preview)
            .textLength(extractedText.length())
            .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyzeResume(@RequestParam("file") MultipartFile file, @RequestParam("jobPosting") String jobPostingText) throws IOException {
        
        //file validation
        if (file.isEmpty()) {
            throw new FileValidationException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new FileValidationException("Invalid file type. Only PDF and DOCX are accepted.");
        }

        //validate job posting text
        if (jobPostingText == null || jobPostingText.trim().length() < 50) {
            throw new FileValidationException("Job posting text is too short. Please provide more details.");
        }

        //run analysis
        AnalysisResult result = analysisService.analyzeResume(file, jobPostingText);

        return ResponseEntity.ok(result);
        
    }
    
}
