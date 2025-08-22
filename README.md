
# 🚀 Grant Matching Application

An AI-powered system for intelligently matching researchers with funding opportunities.  
Built with a **Flask** backend, a **React (Vite)** frontend, and modern AI/NLP techniques for semantic matching.

---

## ✨ Key Features

- 🎯 **AI-driven Matching:** Semantic search and LLM-refined grant-researcher matching
- 🧑‍🔬 **Researcher & Grant Management:** Full database models and APIs
- 🌐 **Smart Web Scraping:** Automated extraction from NIH and CIHR funding databases
- 🧩 **Clean Full-Stack Architecture:** Flask REST API + React frontend with Vite bundler
- 🔥 **Optimized for Scalability:** Modular, extensible, and production-ready design

---

## 🏗️ Project Structure

```
Grant_Matching/
├── app/                # Flask backend (models, routes, agents, utilities)
├── frontend/           # React frontend (pages, components, services)
├── config.py           # Centralized configuration
├── run.py              # Application launcher
├── requirements.txt    # Backend dependencies
├── .gitignore          # Git ignore rules
```

### 🔥 Backend (`/app/`)
- `models.py` — SQLAlchemy models (Researchers, Grants, Matches)
- `routes.py` — Flask API routes (scraping, matching, CRUD operations)
- `agents/grant_matcher.py` — Matching engine: TF-IDF + LLM-enhanced scoring
- `scraper.py` — Web scraping modules for grant data
- `utils/` — Utilities: text cleaning, fingerprinting, data importers

### 🎨 Frontend (`/frontend/`)
- `pages/` — React pages (Home, Researchers, Grants, Match Results, Details)
- `components/` — UI elements (Navbar, etc.)
- `services/api.js` — Centralized API handling (Axios)
- ⚡ Vite-powered build system for ultra-fast frontend development

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL or SQLite (depending on backend configuration)

---

### ⚙️ Backend Setup

```bash
# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Initialize and migrate the database
flask db init
flask db migrate -m "initial migration"
flask db upgrade

# 4. Run the Flask development server
python run.py
```

---

### 🎯 Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the React development server
npm run dev
```

- Frontend accessible at: `http://localhost:5173/`
- Backend API available at: `http://localhost:5000/`

---

## 🛠 Core Matching Logic

1. **Semantic Pre-filtering:**  
   Researcher interests and grant descriptions are embedded using **Sentence Transformers**.
2. **LLM Reasoning:**  
   Fine-tuned scoring through **OpenAI GPT-4o-mini** and **OpenAI GPT-4.1-mini** based on extracted embeddings.
3. **Deduplication:**  
   Fingerprinting is applied to ensure no redundant researcher-grant matches are stored.

**Main matching logic:**  
→ `app/agents/grant_matcher.py`

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/researchers` | `GET` | List all researchers |
| `/grants` | `GET` | List all grants |
| `/matches` | `GET` | Retrieve all matched pairs |
| `/generate_matches` | `POST` | Generate matches (all or specific researcher) |
| `/scrape_nih` | `POST` | Scrape grants from NIH |
| `/scrape_cihr` | `POST` | Scrape grants from CIHR |

(Endpoints defined in `app/routes.py`)

---

## 📜 License

Distributed under the **MIT License** — free to use, modify, and distribute.

---

## 🙏 Acknowledgments

Built with contributions from the amazing open-source community, including:
- OpenAI GPT models
- LangChain
- Sentence Transformers
- Flask, SQLAlchemy
- React, Vite
- SerpAPI, ScrapeGraphAI

---

## 📝 How to Cite

If you use the **Grant Matching Application** in your work, please cite:

**Software**
> Mortezaagha, P. (2025). *Grant Matching Application (v1.0.0)*. GitHub. https://github.com/your-org/Grant_Matching

### BibTeX
```bibtex
@software{mortezaagha_grant_matching_2025,
  author  = {Mortezaagha, Pouria},
  title   = {Grant Matching Application},
  version = {1.0.0},
  year    = {2025},
  url     = {https://github.com/your-org/Grant_Matching},
  license = {MIT},
  note    = {AI-powered researcher–grant semantic matching with Flask + React (Vite)}
}
