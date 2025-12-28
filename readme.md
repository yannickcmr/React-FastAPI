# FastAPI Business Sales API

## 📋 Overview
High-performance **FastAPI** application for solving the (online and offline) **Facility Location Problem** including a dynamic and interactive **React** frontend.

## 🎛️ Solver & Algorithms
The central problem for this project is the so-called **Facility Location Problem**. This problem consists of finding the optimal solution for the provided **Demand** and **Facility** points. The goal is to find the minimal costs for the given points whilst serving all demands.

### Online Solver
The central optimization algorithm for the online case is the so-called *Meyerson Algorithm*. The main idea of this solver for the online problem is to calculate a relative probability consisting of the distance to the nearest facility and the facility opening costs and flip a coin on whether to open a new facility at that location or to assign it to a previously opened facility.

> Let $d, c, p\in\mathbb{R}$ be distance (to the nearest facility), the facility opening costs and the probability bias.

> When a new demand points arrives, calculate the distance $d$ to the nearest facility.

> Then calculate the relative probability relative to the opening costs $c$ with the following equation:
> $$p_{rel} = \min \big( 1, p\cdot \frac{d}{c} \big)$$

> Now flip a coin with the $p_{rel}$. When you flip *Heads*, open a facility at the demand point. When you flip *Tails*, assign the demand point to the nearest facility.

For further information please visit the following white paper: [https://www.cs.toronto.edu/~bor/2420s19/papers/meyerson-online-facilty-location.pdf]

### Offline Solver
The solver for the offline case of the *facility location problem* is the **k-Means Clustering** algorithm. The idea of this solver is to assign all demand points to the nearest facility. Then calculate the new central points for all clustered demand points and set the center of them to the new facility location. Repeat this until a threshold was exceeded.

> Let $d_1, ..., d_n, f_1, ..., f_k\in\mathbb{R}^2$ be demands and facilities.

> For round $1, ..., N$:
>> for each $d_i$: find the nearest facility $f_j$ and assign $d_i$ to $f_j$.

>> for each cluster $1,...,k$: find the new center $c_j$ and set the facility $f_j$ to the new center $c_j$.


## 🚀 Quick Start

### Docker
```bash
docker-compose up -f 'docker-compose.yml' -d --build
```

## 📁 Project Structure
```
react-fastapi/
├── .github/        # Test Pipeline Workflow
├── app/            # FastAPI
│   ├── Dockerfile
│   ├── api.py
│   ├── config
│   ├── model
│   ├── routes
│   ├── validation
├── tests/          # Tests for the FastAPI
├── web/            # React Webapp.
│   ├── Dockerfile
│   ├── app
│   │   ├── public
│   │   ├── src
│   ├── prompts
├── requirements.txt
├── docker-compose.yml
├── pytest.ini
└── readme.md
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/ping` | GET | Health check |
| `/versions` | GET | API version info |
| `/online_facility_location` | POST | Solver using the *Meyerson* algorithm |
| `/offline_facility_location` | POST | Solver using the *k-Means* algorithm |

**Interactive Docs:** 
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`


---

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](LICENSE)

---

**Copy this entire README.md to your repository root.**