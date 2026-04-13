package com.adamscanner.resumescanner.service;

import java.io.IOException;
import java.io.InputStream;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
 
@Service
public class TextExtractionService {
    

    public String extractText(InputStream inputStream, String contentType) throws IOException {
        if(contentType == null) {
            throw new IllegalArgumentException("Content type is required for text extraction.");
        }

        return switch (contentType) {
            case "application/pdf" -> extractFromPdf(inputStream);
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> extractFromDocx(inputStream);
            case "text/plain" -> extractFromDocx(inputStream);
            default -> throw new IllegalArgumentException("Unsupported content type: " + contentType);
        };
    }

    private String extractFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if(text == null || text.trim().isEmpty()) {
                throw new RuntimeException("No text found in PDF document.");
            }

            return text.trim();
        }
    }

    private String extractFromDocx(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            StringBuilder text = new StringBuilder();


            for (XWPFParagraph paragraph : document.getParagraphs()) {
                text.append(paragraph.getText());
                text.append("\n");
            }


            String result = text.toString().trim();

            if (result.isEmpty()) {
                throw new RuntimeException("No text found in DOCX file.");
            }
            return result;
        }
    }

}

