# ⚡ DEVGen - AI Code Generator Copilot

Hi! This is **AI Code Generator Copilot**, a full-stack application I built from scratch to generate code snippets using Artificial Intelligence. My goal was to create a tool that feels like a professional developer product—combining a clean, responsive "dark mode" UI with a robust, scalable backend.

Instead of mocking data, I integrated the real **Google Gemini API** and architected a **PostgreSQL** database to handle persistent user history and efficient pagination.

## 🔗 Live Demo & Resources

* **🚀 Live Frontend:** [https://code-editor-tawny-six.vercel.app](https://code-editor-tawny-six.vercel.app)
* **⚙️ Live Backend:** [https://code-editor-30tn.onrender.com](https://code-editor-30tn.onrender.com)
* **🎥 Video Demo:** [Link to my video walkthrough](https://drive.google.com/file/d/14u2ZIRFI1q1XbGO9zsKwgrQsQPAIePtS/view?usp=drive_link)

---

## 🛠️ The Tech Stack

I carefully selected a modern stack to balance performance with developer experience:

* **Frontend:** React.js (Vite) + Tailwind CSS + Lucide React (for a responsive, IDE-like interface).
* **Backend:** Node.js + Express.js (RESTful API).
* **Database:** PostgreSQL (Hosted on Neon.tech).
* **Database Driver:** `node-postgres` (`pg`) — I chose to write raw, optimized SQL queries for maximum control over the data interaction.
* **AI Model:** Google Gemini 2.0 Flash-lite (via the official `@google/genai` SDK).
* **Deployment:** Vercel (Frontend) & Render (Backend).

---

## 🏗️ Engineering Decisions (Database & Schema)

### 1. Why Relational (PostgreSQL)?
The assignment required a relational database, but frankly, it was the correct architectural choice regardless. The data relationship here is strict and structured: **One User** creates **Many Generations**.

Using a SQL database allows me to enforce **Referential Integrity**. I created two primary tables:
* **`users`**: Stores identity (ID, username, email).
* **`generations`**: Stores the actual content (prompt, code, language, timestamp).

### 2. Normalization & Constraints
I designed the schema to adhere to **Third Normal Form (3NF)**:
* **Why?** I separated User details from Generation data. This drastically reduces redundancy. If a user updates their email, I only need to update one row in the `users` table, not thousands of history records.
* **Safety:** I implemented a `FOREIGN KEY` constraint (`user_id`) on the `generations` table. This guarantees data integrity—it is impossible to have an "orphan" code snippet that doesn't belong to a valid user.

---

## 🧠 Complexity Analysis (Scalability)

### 1. Time Complexity of Pagination
**Complexity:** **O(log N + K)**

For the history feed, I implemented SQL offset pagination (`LIMIT` & `OFFSET`).
* **N** is the total number of rows in the index.
* **K** is the page size (limit).

While offset pagination can degrade on massive datasets, it is highly performant here due to my indexing strategy. The database engine utilizes a B-Tree search (**log N**) to locate the specific user's records instantly, then retrieves the next set of rows (**K**).

### 2. Indexing Strategy
**Did I create indexes? Yes.**

I explicitly defined indexes in my migration scripts to optimize the two most critical query patterns:
1.  `idx_generations_user_id`: Optimizes fetching history for a specific user.
2.  `idx_generations_created_at`: Optimizes sorting the feed by "Newest First".

**Impact:** Without these indexes, the database would perform a **Sequential Scan** (O(N)), checking every single row in the table to find a user's history. With them, it performs an **Index Scan**, making retrieval instant even as the dataset grows to millions of records.

---

## 🔌 API Endpoints

I built a clean RESTful API to communicate between the client and server:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/generate` | Accepts `{ prompt, language, userId }`. Calls Gemini AI, cleans the output, and saves it to Postgres. |
| `GET` | `/api/history` | Returns paginated history. Supports query params: `?userId=1&page=1&limit=10`. |

---

## ⚙️ How to Run Locally

Follow these steps to get the project running on your machine:

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with: DB_HOST, DB_USER, DB_PASSWORD, GEMINI_API_KEY
npm run db:init  # Runs the migration script to create tables
npm run dev      # Starts the server on localhost:8000
```

### 1. Backend Setup
```bash
cd frontend
npm install
npm run dev      # Starts the React app on localhost:5173