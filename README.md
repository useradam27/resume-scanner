# AI Resume Scanner
 
A full-stack AI-powered resume analysis tool that compares resumes against job postings using AWS Bedrock (Claude). Users upload a resume, paste a job description, and receive an AI-generated match score along with actionable suggestions for improvement.
 
**Status:** In active development
 
This is a portfolio project built to demonstrate full-stack development and AWS cloud architecture skills.
 
## Tech Stack
 
- **Backend:** Java 17, Spring Boot 3.2, Apache PDFBox, Apache POI
- **Frontend:** React 18, Vite, Tailwind CSS
- **AWS:** S3, Bedrock (Claude), DynamoDB, Cognito, CloudFront, Elastic Beanstalk
 
## Current Progress
 
The backend currently supports resume file uploads (PDF and DOCX), stores them in S3, and extracts the text content for analysis. The frontend scaffolding is in place with routing and styling configured.
 
## Roadmap
 
- AWS Bedrock integration for AI-powered resume analysis
- Frontend UI for upload, analysis, and results display
- DynamoDB integration for analysis history and caching
- AWS Cognito authentication and multi-user support
- Production deployment with CI/CD
 
## Author
 
Built by Adam as a portfolio project. [GitHub: useradam27](https://github.com/useradam27)
 