# 🚀 Judge0 Deployment on Render

## 🆓 Free External Services Setup (REQUIRED FIRST)

### Step 1: PostgreSQL - Use Neon.tech (FREE)

1. Go to [neon.tech](https://neon.tech) → Sign up free
2. Create new project → Name: `judge0`
3. Create database named `judge0`
4. Copy connection details:
   ```
   Host: ep-lively-dew-advg1w10-pooler.c-2.us-east-1.aws.neon.tech
   Database: neondb
   User: neondb_owner
   Password: npg_SNc8AUDt4gap
   Port: 5432
   ```
   
   ⚠️ **CRITICAL - Full DATABASE_URL with Neon-specific parameters:**
   ```
   postgresql://neondb_owner:npg_SNc8AUDt4gap@ep-lively-dew-advg1w10-pooler.c-2.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&options=endpoint%3Dep-lively-dew-advg1w10
   ```
   
   **Why the extra parameters?**
   - `sslmode=require` - Neon requires SSL connections
   - `options=endpoint%3Dep-lively-dew-advg1w10` - Old Judge0 PostgreSQL client needs endpoint ID for SNI support

**Alternative PostgreSQL Options:**
| Provider | Free Tier | Link |
|----------|-----------|------|
| **Neon** ⭐ | 0.5 GB, 3 branches | [neon.tech](https://neon.tech) |
| **Supabase** | 500 MB, 2 projects | [supabase.com](https://supabase.com) |
| **Railway** | $5 credit/month | [railway.app](https://railway.app) |
| **ElephantSQL** | 20 MB | [elephantsql.com](https://elephantsql.com) |

---

### Step 2: Redis - Use Upstash (FREE)

1. Go to [upstash.com](https://upstash.com) → Sign up free
2. Create new Redis database
3. Select region closest to Render (e.g., US-East)
4. Copy connection details:
   ```
   Host: powerful-serval-42148.upstash.io
   Port: 6379
   Password: AaSkAAIncDEyN2E2MjMyMDYxNzA0NDI0YWRjY2NkNWViMTg0ZjNiY3AxNDIxNDg
   ```
   
   ⚠️ **CRITICAL - REDIS_URL with TLS (note 'rediss://' with double 's'):**
   ```
   rediss://default:AaSkAAIncDEyN2E2MjMyMDYxNzA0NDI0YWRjY2NkNWViMTg0ZjNiY3AxNDIxNDg@powerful-serval-42148.upstash.io:6379
   ```
   
   **Why TLS?** Upstash requires encrypted connections. The `rediss://` protocol enables TLS/SSL.

**Alternative Redis Options:**
| Provider | Free Tier | Link |
|----------|-----------|------|
| **Upstash** ⭐ | 10K commands/day | [upstash.com](https://upstash.com) |
| **Redis Cloud** | 30 MB | [redis.com/cloud](https://redis.com/try-free/) |
| **Railway** | $5 credit/month | [railway.app](https://railway.app) |

---

## 🖥️ Deploy Judge0 on Render

### 🚀 Method 1: Deploy via GitHub (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Judge0 deployment files"
git push origin main
```

#### Step 2: Create Web Service from GitHub
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Connect your GitHub repo: `coding-platform`
5. Click **"Connect"**

#### Step 3: Configure Build Settings
| Setting | Value |
|---------|-------|
| **Name** | `judge0-server` |
| **Region** | `US East (Ohio)` |
| **Root Directory** | `judge0-deploy` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` |
| **Instance Type** | `Standard` ($25/mo) or `Starter` ($7/mo) |

#### Step 4: Add Environment Variables
Click **"Add Environment Variable"** for each:

⚠️ **CRITICAL:** Use `DATABASE_URL` and `REDIS_URL` for proper TLS/SSL connections!

| Key | Value |
|-----|-------|
| `RAILS_ENV` | `production` |
| `RAILS_MAX_THREADS` | `5` |
| `SECRET_KEY_BASE` | `<run: openssl rand -hex 32>` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_SNc8AUDt4gap@ep-lively-dew-advg1w10-pooler.c-2.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&options=endpoint%3Dep-lively-dew-advg1w10` |
| `REDIS_URL` | `rediss://default:AaSkAAIncDEyN2E2MjMyMDYxNzA0NDI0YWRjY2NkNWViMTg0ZjNiY3AxNDIxNDg@powerful-serval-42148.upstash.io:6379` |
| `ENABLE_WAIT_RESULT` | `true` |
| `ENABLE_COMPILER_OPTIONS` | `true` |
| `ALLOWED_ORIGINS` | `*` |
| `AUTHN_TOKEN` | `<your-secure-token>` |
| `AUTHZ_TOKEN` | `<your-secure-token>` |

#### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for build & deployment
3. Copy your URL: `https://judge0-server-xxxx.onrender.com`

#### Step 6: Test API (Optional - Test before deploying workers)
```bash
# Health check
curl https://judge0-server-xxxx.onrender.com/health

# Get languages
curl https://judge0-server-xxxx.onrender.com/languages
```

---

### 👷 Deploy Workers via GitHub

⚠️ **IMPORTANT:** Workers are **REQUIRED** for code execution!

**When to deploy workers:**
- ✅ **Now** - If you want to test code execution immediately
- ⏳ **Later** - If you're just testing API endpoints first (submissions won't execute)
- 🚀 **Production** - MUST have workers for your platform to work

**Note:** Your Kafka/RabbitMQ handles YOUR microservice queue. Judge0 has its OWN internal queue (Redis) that needs Judge0 workers to process code execution.

#### Architecture:
```
Your API → Kafka/RabbitMQ → Your Worker → Judge0 Server → Redis Queue → Judge0 Workers → Code Execution
```

#### Step 1: Create Background Worker
1. Click **"New +"** → **"Background Worker"**
2. Select **"Build and deploy from a Git repository"**
3. Connect same GitHub repo

#### Step 2: Configure Worker Settings
| Setting | Value |
|---------|-------|
| **Name** | `judge0-workers` |
| **Region** | `US East (Ohio)` |
| **Root Directory** | `judge0-deploy` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile.worker` |
| **Instance Type** | `Standard` ($25/mo) or `Starter` ($7/mo) |

#### Step 3: Add Environment Variables
**Copy ALL env vars from the web service** + add:
| Key | Value |
|-----|-------|
| `INTERVAL` | `0.1` |
| `COUNT` | `2` |

#### Step 4: Deploy
Click **"Create Background Worker"**

---

### 🐳 Method 2: Deploy from Docker Registry (Alternative)

If you prefer not to use GitHub:

### Option 1: One-Click Deploy with Blueprint

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **Blueprints** → **New Blueprint Instance**
4. Connect your GitHub repo
5. Select the `render.yaml` file
6. Click **Apply** → Done! 🎉

---

### Option 2: Manual Deploy (Step by Step)

#### Step 1: Get External Service Credentials (See Above)
- Neon PostgreSQL → Copy host, user, password
- Upstash Redis → Copy host, port, password

#### Step 2: Deploy Judge0 Web Service on Render

1. Go to Render Dashboard → **New** → **Web Service**
2. Select **Deploy an existing image from a registry**
3. Image URL: `judge0/judge0:1.13.1`
4. Configure:
   - **Name:** `judge0-server`
   - **Region:** US East (closest to your DB/Redis)
   - **Plan:** Standard ($25/mo) - **Minimum recommended!**

5. Add Environment Variables:
   ```
   RAILS_ENV=production
   RAILS_MAX_THREADS=5
   SECRET_KEY_BASE=<generate-with: openssl rand -hex 32>
   
   # Neon PostgreSQL
   POSTGRES_HOST=ep-lively-dew-advg1w10-pooler.c-2.us-east-1.aws.neon.tech
   POSTGRES_DB=neondb
   POSTGRES_USER=neondb_owner
   POSTGRES_PASSWORD=npg_SNc8AUDt4gap
   POSTGRES_PORT=5432
   
   # Upstash Redis
   REDIS_HOST=powerful-serval-42148.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=AaSkAAIncDEyN2E2MjMyMDYxNzA0NDI0YWRjY2NkNWViMTg0ZjNiY3AxNDIxNDg
   
   # Judge0 Config
   ENABLE_WAIT_RESULT=true
   ENABLE_COMPILER_OPTIONS=true
   ALLOWED_ORIGINS=*
   AUTHN_TOKEN=<generate-secure-token>
   AUTHZ_TOKEN=<generate-secure-token>
   ```

6. Click **Create Web Service**

#### Step 3: Deploy Judge0 Workers

1. Go to Render Dashboard → **New** → **Background Worker**
2. Select **Deploy an existing image from a registry**
3. Image URL: `judge0/judge0:1.13.1`
4. Docker Command: `./scripts/workers`
5. **Copy ALL environment variables from Step 2**
6. Click **Create Background Worker**

---

## 🔧 Local Testing

Before deploying, test locally:

```bash
cd judge0-deploy

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Test the API
curl http://localhost:2358/health

# Submit test code
curl -X POST http://localhost:2358/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "source_code": "print(\"Hello World\")",
    "language_id": 71
  }'

# Stop services
docker-compose down
```

---

## 🔗 Connect to Your Coding Platform

After deployment, update your `.env`:

```env
# Replace with your Render Judge0 URL
JUDGE0_API_URL=https://judge0-server-xxxx.onrender.com

# If you set AUTHN_TOKEN in Judge0
JUDGE0_API_KEY=your-authn-token-here
```

Update `judge0Service.js` if needed:

```javascript
const headers = {
  'Content-Type': 'application/json',
  'X-Auth-Token': process.env.JUDGE0_API_KEY // For self-hosted
};
```

---

## 📊 Language IDs Reference

| ID | Language |
|----|----------|
| 50 | C (GCC 9.2.0) |
| 54 | C++ (GCC 9.2.0) |
| 62 | Java (OpenJDK 13.0.1) |
| 71 | Python (3.8.1) |
| 63 | JavaScript (Node.js 12.14.0) |
| 72 | Ruby (2.7.0) |
| 73 | Rust (1.40.0) |
| 60 | Go (1.13.5) |
| 78 | Kotlin (1.3.70) |
| 51 | C# (Mono 6.6.0.161) |

Full list: `GET /languages`

---

## 💰 Total Cost Breakdown (With Free External Services)

| Service | Provider | Cost |
|---------|----------|------|
| Judge0 Server | Render Standard | $25/mo |
| Judge0 Workers | Render Standard | $25/mo |
| PostgreSQL | **Neon.tech** | **FREE** ✅ |
| Redis | **Upstash** | **FREE** ✅ |
| **Total** | | **~$50/mo** |

### 💡 Even Cheaper Options:
- Use Render **Starter** plan ($7/mo each) for low traffic = **$14/mo total**
- Use Railway's $5 credit for Judge0 + free DB/Redis = **Nearly FREE**

---

## ⚠️ Important Notes

### Security
- **NEVER** expose `AUTHN_TOKEN` publicly
- Use environment variables for all secrets
- Enable HTTPS (Render does this automatically)

### Performance
- Judge0 requires **privileged** Docker access for sandboxing
- Render's Standard plan is minimum for reliable execution
- Scale workers for higher throughput

### Limitations on Render
- Free tier doesn't support privileged containers
- Background workers needed for code execution
- Cold starts may cause initial delays

---

## 🐛 Troubleshooting

### "Service Unavailable" Error
- Wait 2-3 minutes for cold start
- Check worker logs for errors
- Verify Redis/PostgreSQL connections

### Code Execution Timeout
- Increase worker count
- Check Redis queue backlog
- Verify worker is running

### Database Connection Failed
- Verify internal hostname (not external URL)
- Check password matches
- Ensure same Render region

### View Logs
```bash
# In Render Dashboard
Services → judge0-server → Logs
Services → judge0-workers → Logs
```

---

## 🔄 Alternative: Railway.app

If Render doesn't work, try [Railway](https://railway.app):

```bash
# One-click deploy
railway login
railway init
railway up
```

Railway supports privileged containers better for Judge0.

---

## 📚 Resources

- [Judge0 Documentation](https://github.com/judge0/judge0)
- [Judge0 API Docs](https://ce.judge0.com/)
- [Render Documentation](https://render.com/docs)
- [Docker Hub - Judge0](https://hub.docker.com/r/judge0/judge0)

---

**Created:** December 21, 2025  
**Judge0 Version:** 1.13.1  
**Render Compatible:** ✅
