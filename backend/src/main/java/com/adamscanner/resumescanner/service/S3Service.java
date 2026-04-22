package com.adamscanner.resumescanner.service;

import java.io.InputStream;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Service
public class S3Service {
    private final S3Client s3Client;
    private final String bucketName;

    public S3Service(S3Client s3Client, @Qualifier("s3BucketName") String bucketName) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    public String uploadFile(String key, InputStream inputStream, String contentType, long contentLength) {
        try{
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .contentLength(contentLength)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, contentLength));
            return key;
        } catch (S3Exception e) {
            throw new RuntimeException("Failed to upload file to S3: " + e.getMessage(), e);
        }
    }

    public InputStream downloadFile(String key) {
        try {
            GetObjectRequest request = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            return s3Client.getObject(request);
        } catch (S3Exception e) {
            throw new RuntimeException("Failed to download file from S3: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String key) {
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(request);
        } catch (S3Exception e) {
            throw new RuntimeException("Failed to delete file from S3: " + e.getMessage(), e);
        }
    }

}
