# 🗳️ Voter List Management System

A secure, intelligent, and scalable **Voter Identification & De-duplication System** designed to prevent duplicate voter registrations while ensuring transparency, privacy, and user trust. The platform combines **deterministic rule-based validation** with **machine learning–driven similarity detection** to ensure high accuracy before inserting records into the final voter database.

---

## 📌 Problem Statement

Conventional voter registration systems rely heavily on siloed databases and manual verification, resulting in duplicate registrations, delayed approvals, and inconsistent records. These issues are magnified at scale and for migrant populations, making **automated duplication detection, auditability, and privacy** essential.

---

## 🚀 Solution Overview

This system adopts a **layered verification architecture**. Every application is first stored in a temporary intake layer, then evaluated through rule checks and an ML similarity model. Only clean, verified records are promoted to the final voter list, ensuring accuracy, fairness, and accountability.

---

## ✨ Key Features

- **User-Centric Registration Flow**  
  A single unified form with real-time status tracking (*pending, approved, under review*) for clarity and trust.

- **Hybrid Duplicate Detection Engine**  
  Rule-based checks (Aadhaar hash, DOB, name similarity) combined with an ML similarity model for superior accuracy.

- **Privacy-First & Audit-Ready Design**  
  Hashed identifiers protect sensitive data; detailed logs and manual review workflows provide explainability and traceability.

---

## 🧠 System Architecture

1. **Voter Application Layer** – Captures all new registration requests  
2. **Rule-Based Validation** – Fast deterministic checks against the full voter database  
3. **ML Similarity Model** – Computes duplication probability using multiple attributes  
4. **Decision Engine** – Approves, rejects, or routes to manual review  
5. **Verified Voter Database** – Stores only clean, verified records  

---

## 🗄️ Database Design

- **voter_applications** – All incoming registration requests  
- **voters** – Verified, non-duplicate voters  
- **duplicate_checks** – Rule scores, ML scores, and decisions  
- **manual_reviews** – Human verification for edge cases  

This separation preserves data integrity and prevents premature insertions.

---

## 🛠️ Tech Stack

- **Backend:** Node.js / Express  
- **Database:** PostgreSQL  
- **ML Component:** Python-based similarity model  
- **Security:** Hashing for sensitive identifiers  
- **Deployment:** Cloud PostgreSQL (Supabase / Neon / Railway)

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/GoyalHarshit18/VoterList-Management-System.git

# Navigate to the project directory
cd VoterList-Management-System

# Install dependencies
npm install

# Configure environment variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voter_db
DB_USER=postgres
DB_PASSWORD=your_password

# Start the backend server
npm start
