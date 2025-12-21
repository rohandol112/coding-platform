# 🔑 Portal API - API Keys & Configuration Guide

## Quick Setup Reference

### 1. Judge0 API (Required for Code Execution)

**Get API Key:**
1. Go to https://rapidapi.com/judge0-official/api/judge0
2. Sign up / Login
3. Subscribe (Free tier available)
4. Copy your API key

**.env Configuration:**
```env
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-api-key-here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

**Alternative: Self-Hosted Judge0 (Local)**
```env
# For local Docker deployment:
JUDGE0_API_URL=http://localhost:2358
```

**Alternative: Render-Hosted Judge0 (Production)**
```env
# After deploying Judge0 on Render (see judge0-deploy/README.md):
JUDGE0_API_URL=https://judge0-server-xxxx.onrender.com
JUDGE0_API_KEY=your-authn-token-from-render

# Deploy Judge0 on Render:
# 1. cd judge0-deploy
# 2. docker-compose up -d  (test locally first)
# 3. Push to GitHub
# 4. Render Dashboard → Blueprints → New → Select render.yaml
```

---

### 2. Message Queue (Required for Submission Judging)

Choose ONE of the following:

#### Option A: Kafka (Recommended for high volume)
```env
KAFKA_BROKERS=kafka1:9092,kafka2:9092,kafka3:9092
```

#### Option B: RabbitMQ (Simpler setup)
```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672
# With authentication:
RABBITMQ_URL=amqp://username:password@localhost:5672
```

**Note:** API will use Kafka first, fallback to RabbitMQ

---

### 3. Google OAuth (For Portal Login)

**Get Credentials:**
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs: `http://localhost:8080/api/portal/auth/google/callback`

**.env Configuration:**
```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8080/api/portal/auth/google/callback
```

---

### 4. Twilio SMS/OTP (For Phone Authentication)

**Get Credentials:**
1. Go to https://www.twilio.com/console
2. Get Account SID and Auth Token
3. Create Verify Service for OTP
4. Verify your phone number

**.env Configuration:**
```env
TWILIO_ACCOUNT_SID=your-account-sid-here
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_PHONE_NUMBER=your-twilio-phone-number
TWILIO_SERVICE_SID=your-verify-service-sid
```

---

### 5. Email Service (For Notifications)

**Using Gmail:**
1. Enable 2FA on your Gmail account
2. Generate App Password (https://myaccount.google.com/apppasswords)
3. Use app password, NOT your regular password

**.env Configuration:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM_NAME=Coding Platform
```

**Alternative Providers:**
```env
# SendGrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key

# AWS SES
EMAIL_HOST=email-smtp.region.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-aws-ses-username
EMAIL_PASSWORD=your-aws-ses-password
```

---

### 6. JWT Secret (For Authentication)

**.env Configuration:**
```env
JWT_SECRET=your-super-secret-key-min-32-chars-recommended
JWT_EXPIRATION=24h
```

**Generate strong secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 7. Database Connection

**.env Configuration:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/coding_platform"
```

---

### 8. Redis (For Caching & Rate Limiting)

**.env Configuration:**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Leave empty if no password
```

---

## 🚀 Deployment Checklist

- [ ] Judge0 API key obtained and configured
- [ ] Kafka OR RabbitMQ configured
- [ ] Google OAuth credentials configured
- [ ] Twilio SMS credentials configured
- [ ] Email provider configured
- [ ] JWT secret generated and set
- [ ] Database URL configured
- [ ] Redis configured
- [ ] All environment variables in `.env` file
- [ ] `.env` file added to `.gitignore` (DO NOT COMMIT)

---

## 🔒 Security Notes

1. **NEVER commit `.env` file** - Add to `.gitignore`
2. **Rotate API keys** every 90 days
3. **Use strong JWT secret** - Min 32 characters
4. **Enable HTTPS** in production
5. **Use environment-specific configs** for dev/staging/prod
6. **Restrict CORS** to your frontend domain only
7. **Rate limit** submission endpoints (already implemented)

---

## 🧪 Testing API Keys Locally

```bash
# Test Judge0 connection
curl -X GET "https://judge0-ce.p.rapidapi.com/languages" \
  -H "X-RapidAPI-Key: YOUR_KEY" \
  -H "X-RapidAPI-Host: judge0-ce.p.rapidapi.com"

# Test RabbitMQ connection
rabbitmqctl status

# Test Kafka connection
kafka-console-consumer.sh --bootstrap-servers localhost:9092 --topic test

# Test email
npm run test:email

# Test Google OAuth
npm run test:oauth
```

---

## 📊 Portal API Endpoints That Use These Keys

| Endpoint | Uses | Required |
|----------|------|----------|
| POST `/api/portal/submissions` | Kafka/RabbitMQ | ✅ |
| POST `/api/portal/submissions/run` | Judge0 API | ✅ |
| POST `/api/portal/auth/google/callback` | Google OAuth | ✅ |
| POST `/api/portal/auth/phone/send-otp` | Twilio SMS | ✅ |
| POST `/api/portal/auth/phone/verify-otp` | Twilio SMS | ✅ |
| All endpoints | JWT Secret | ✅ |
| All endpoints | Database URL | ✅ |
| Rate limiting | Redis | ✅ |

---

## ⚠️ Common Issues & Solutions

### Judge0 API Returns 401
- **Cause:** Invalid API key or expired
- **Fix:** Regenerate key from RapidAPI

### Submissions Not Being Judged
- **Cause:** Kafka/RabbitMQ not running or not configured
- **Fix:** Start message queue, check `KAFKA_BROKERS` or `RABBITMQ_URL`

### Code Execution Timeout
- **Cause:** Judge0 unreachable or rate limited
- **Fix:** Check internet, verify API key, check rate limits

### Email Not Sending
- **Cause:** Invalid SMTP credentials
- **Fix:** Verify email provider settings, check app-specific password

### OAuth Redirect Error
- **Cause:** Incorrect redirect URI
- **Fix:** Match exactly in Google Cloud Console

---

## 📚 Documentation Links

- Judge0 API: https://rapidapi.com/judge0-official/api/judge0
- RabbitMQ Setup: https://www.rabbitmq.com/download.html
- Kafka Setup: https://kafka.apache.org/quickstart
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Twilio SMS: https://www.twilio.com/docs/sms
- PostgreSQL: https://www.postgresql.org/

---

**Setup Time:** ~15 minutes  
**Difficulty:** Easy  
**Support:** Check documentation links above

*Last Updated: December 19, 2025*
