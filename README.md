# Resume Match Scanner

A full-stack web app that scores your resume against a job posting using Claude on AWS Bedrock.

Live at [resume-match.dev](https://resume-match.dev).

## Screenshots

<!-- Drop a screenshot or GIF of the upload, results, and history pages here -->
*Coming soon*

## Features

- Upload a resume (PDF or DOCX, 10MB max)
- AI analysis against a pasted job posting — match score, missing keywords, suggestions, strengths
- History page with every past analysis, scoped to the logged-in user
- Re-open any past analysis without re-running it
- Caching by resume + job-posting hash so identical runs don't re-hit Bedrock
- Cognito Hosted UI for sign-up, login, and email verification

## AWS Services

| Service | Role | Why |
|---|---|---|
| CloudFront | CDN + single entry point for SPA and `/api/*` | One domain = no CORS, free HTTPS, edge caching for the React build |
| S3 (frontend) | Hosts the React build | Cheap static hosting, locked down behind CloudFront via OAC |
| S3 (uploads) | Stores resume files under `resumes/{userId}/...` | Durable, cheap, and decoupled from the compute layer |
| Elastic Beanstalk | Runs the Spring Boot API on EC2 | Lets me ship a JAR without hand-rolling EC2 + Nginx setup |
| Bedrock (Claude Sonnet 4.5) | Generates the match score and suggestions | No model hosting, pay per token, and the JSON output is reliable |
| DynamoDB | Stores analysis history and caches repeated runs | Per-user partition key gives natural data isolation; on-demand = ~$0 idle |
| Cognito | Sign-up, login, JWT issuing | I don't want to own password handling — Hosted UI takes care of it |
| IAM | Service-to-service permissions via the EB instance role | No AWS keys in code; least privilege per service |

## Tech Stack

- **Backend:** Java 17, Spring Boot 4, Spring Security (JWT), AWS SDK v2, Apache PDFBox, Apache POI, Maven
- **Frontend:** React 19, Vite, Tailwind CSS, Axios, React Router
- **AWS:** CloudFront, S3, Elastic Beanstalk, Bedrock, DynamoDB, Cognito, IAM
- **CI/CD:** GitHub Actions

## Local Development

### Prerequisites
- Java 17
- Maven 3.9+
- Node.js 22+
- An AWS account with access to S3, DynamoDB, Bedrock, and Cognito (or just hit the deployed API)
- AWS credentials configured locally (`aws configure`) for the dev IAM user

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API runs on `http://localhost:5000`. Config lives in `src/main/resources/application.yaml` for local defaults and `application-prod.yml` for the deployed env. The local profile expects these env vars (or just edit the yaml):

```
AWS_REGION=us-east-1
S3_BUCKET_NAME=<your-uploads-bucket>
DYNAMODB_TABLE_NAME=<your-table>
BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-5-20250929-v1:0
COGNITO_USER_POOL_ID=<your-pool-id>
COGNITO_CLIENT_ID=<your-client-id>
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. Cognito config lives in `frontend/.env.development`:

```
VITE_COGNITO_DOMAIN=https://<your-cognito-domain>
VITE_COGNITO_CLIENT_ID=<your-client-id>
VITE_REDIRECT_URI=http://localhost:5173/callback
```

Make sure `http://localhost:5173/callback` is added to the allowed callback URLs in your Cognito App Client.

## Deployment

Both apps deploy through GitHub Actions on push to `main`:

- **Backend:** [`.github/workflows/deploy-backend.yml`](.github/workflows/deploy-backend.yml) — builds the JAR with Maven and ships it to Elastic Beanstalk
- **Frontend:** [`.github/workflows/deploy-frontend.yml`](.github/workflows/deploy-frontend.yml) — builds the React app, syncs to S3, and invalidates the CloudFront cache

Both also support `workflow_dispatch` for manual runs from the Actions tab.

AWS credentials live in GitHub Repository Secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`). 

## API

All endpoints live under `/api` and require a Cognito JWT in the `Authorization: Bearer` header, except for `/api/health`.

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check. Public. |
| POST | `/api/upload` | Upload a resume to S3 and return extracted text preview |
| GET | `/api/download?key={s3Key}` | Download a previously uploaded resume (path-prefix checked) |
| POST | `/api/analyze` | Analyze a resume against a job posting and save the result |
| GET | `/api/history` | List the current user's past analyses, newest first |
| GET | `/api/analysis/{analysisId}` | Fetch a single past analysis by ID |

## Author

Built by Adam Gerena as a portfolio project — [github.com/useradam27](https://github.com/useradam27).
