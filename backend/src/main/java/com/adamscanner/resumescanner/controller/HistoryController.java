package com.adamscanner.resumescanner.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adamscanner.resumescanner.model.AnalysisResult;
import com.adamscanner.resumescanner.service.DynamoDbService;

@RestController
@RequestMapping("/api")
public class HistoryController {
    
    private final DynamoDbService dynamoDbService;

    public HistoryController(DynamoDbService dynamoDbService) {
        this.dynamoDbService = dynamoDbService;
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, String>>> getHistory() {
        String userId = "dev-user"; 
        List<Map<String, String>> history = dynamoDbService.getHistory(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<AnalysisResult> getAnalysis(@PathVariable String analysisId) {
        String userId = "dev-user"; 
        AnalysisResult result = dynamoDbService.getAnalysis(userId, analysisId);
        return ResponseEntity.ok(result);
    }
}
