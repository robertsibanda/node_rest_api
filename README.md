# Node.js REST API

## Setup

```bash
cp .env.example .env
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/signup` | Create user | No |
| POST | `/api/v1/login` | Login | No |
| GET | `/api/v1/dashboard` | Dashboard | Yes |
| POST | `/api/v1/token` | Refresh token | No |
| GET | `/api/v1/courses` | Get all courses | Yes |
| GET | `/api/v1/courses/:id` | Get course | Yes |
| PATCH | `/api/v1/courses/:id` | Edit course | Yes |
| DELETE | `/api/v1/courses/:id` | Delete course | Yes |
| POST | `/api/v1/courses/add` | Create course | Yes |
