package com.adamscanner.resumescanner.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;



@Service
public class BedrockService {
    
    private final BedrockRuntimeClient bedrockClient;
    private final String modelId;
    private final ObjectMapper objectMapper;

    public BedrockService(BedrockRuntimeClient bedrockClient, String modelId, ObjectMapper objectMapper) {
        this.bedrockClient = bedrockClient;
        this.modelId = modelId;
        this.objectMapper = objectMapper;
    }
}
