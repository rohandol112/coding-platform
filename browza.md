# BROWZA – JOB MANAGEMENT SYSTEM

A full-stack SaaS dashboard to manage, track, and execute scraping jobs. Built with a focus on strict state management, security, and a clean, modern UI.

---

## KEY FEATURES

- **Secure Authentication**: Complete User Sign Up & Login system using JWT and Bcrypt
- **Data Isolation**: Multi-tenancy support — users can only access and modify their own jobs
- **Advanced Search**: Real-time search functionality to filter jobs by title
- **Strict State Machine**: Jobs follow a logical flow (PENDING → RUNNING → COMPLETED/FAILED) to prevent data corruption
- **Responsive UI**: Built with Tailwind CSS, featuring a slide-out details drawer and dynamic status badges

---

## TECH STACK

### Frontend (Client)

| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | Framework |
| Tailwind CSS | Styling |
| lucide-react | Icons |
| React Context API & Native Fetch | State Management |

### Backend (Server)

| Technology | Purpose |
|------------|---------|
| Node.js & Express | Runtime |
| MongoDB & Mongoose | Database |
| jsonwebtoken (JWT) & bcryptjs | Authentication |

---

## FOLDER STRUCTURE

```
root
├── backend
│   ├── src
│   │   ├── config       (DB Connection)
│   │   ├── controllers  (Business Logic)
│   │   ├── models       (DB Schemas)
│   │   ├── routes       (API Endpoints)
│   │   └── middleware   (Auth Protection)
│   └── server.js        (Entry Point)
│
└── frontend
    ├── app              (Pages & Routes)
    ├── components       (UI Components)
    ├── context          (Auth Provider)
    └── lib              (API Helpers)
```

---

## HOW TO RUN LOCALLY

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

---

### 2. Setup Backend

Open a terminal in the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file (replace with your actual MongoDB URI):

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey
```

Run the backend server:

```bash
npm run dev
```

Server runs on: http://localhost:5000

---

### 3. Setup Frontend

Open a new terminal in the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Client runs on: http://localhost:3000

---

## ASSUMPTIONS MADE

### 1. Workflow Logic

A job cannot be marked "Completed" if it hasn't started yet. The system strictly enforces the flow:

```
PENDING → RUNNING → COMPLETED / FAILED
```

### 2. Job Assignment (Strict Contract)

Once a job has been created, critical fields like **Title** and **Budget** cannot be edited. This ensures the contract remains valid after creation.

### 3. Persistence

No Soft Delete was implemented; data is stored permanently for historical reporting.

---

## IMPROVEMENTS (FUTURE ROADMAP)

### 1. Server-Side Pagination & Optimization

**Current State:**
The dashboard fetches all user jobs at once.

**Improvement:**
If a user has 1,000+ jobs, performance will drop. Pagination will be implemented to fetch jobs in batches of 5 (sorted by latest). The UI will include **Next** and **Previous** buttons. This will reduce database load and improve Time to Interactive.

---

### 2. Containerization

Docker support will be added to spin up the Database, Backend, and Frontend using a single command:

```bash
docker-compose up
```

This will simplify developer onboarding significantly.

---

### 3. Real-Time Updates

WebSockets (Socket.io) will be implemented so that when a background worker fails a job, the dashboard updates instantly without requiring a page refresh.

---

## LICENSE

MIT License
