# FastAPI Business Sales API

## 📋 Overview
High-performance FastAPI application for processing large business sales datasets (600MB+). Features chunked CSV reading, RESTful endpoints, Docker support, and comprehensive logging.

## 🚀 Quick Start

### Local Development
```bash
# 1. Clone & setup
git clone https://github.com/yourusername/fastapi-sales-api.git
cd fastapi-sales-api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Add your CSV file
mkdir -p app/dataset
cp /path/to/business_sales.csv app/dataset/

# 4. Run API
uvicorn app.api:app --reload --host 0.0.0.0 --port 8000
```

### Docker
```bash
# Build and run
docker build -t fastapi-sales-api .
docker run -d -p 8000:8000 \
  -v $(pwd)/app/dataset:/app/app/dataset \
  fastapi-sales-api

# Or use Docker Compose
docker-compose up -d
```

## 📁 Project Structure
```
fastapi-sales-api/
├── app/
│   ├── api.py                  # Main FastAPI app
│   ├── config/
│   │   └── logging_config.py   # Logging setup
│   ├── validation/
│   │   └── messages.py         # Pydantic models
│   └── dataset/
│       ├── dataset.py          # CSV reader (chunked)
│       └── business_sales.csv  # Your data (gitignored)
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/ping` | GET | Health check |
| `/versions` | GET | API version info |
| `/get_data` | GET | Retrieve sales data |
| `/filter_data` | POST | Filter sales data |

**Interactive Docs:** 
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Example Usage
```python
# Get all data
curl http://localhost:8000/get_data

# Filter data
curl -X POST http://localhost:8000/filter_data \
  -H "Content-Type: application/json" \
  -d '{"query": "amount > 1000 and region == \"EMEA\""}'
```

## ⚙️ Configuration

### Environment Variables (`.env`)
```env
APP_NAME=FastAPI Sales API
LOG_LEVEL=INFO
DATA_FILE=app/dataset/business_sales.csv
CHUNK_SIZE=10000
HOST=0.0.0.0
PORT=8000
```

### DatasetReader Settings
```python
from app.dataset.dataset import DatasetReader

# Initialize with custom chunk size
dataset = DatasetReader("business_sales.csv", chunk_size=5000)

# Get data
data = dataset.find()  # All data
filtered = dataset.find("amount > 1000")  # With query
```

## 🐳 Docker Commands

```bash
# Build
docker build -t fastapi-sales-api .

# Run
docker run -d -p 8000:8000 \
  -v $(pwd)/app/dataset:/app/app/dataset \
  fastapi-sales-api

# View logs
docker logs -f fastapi-sales-api

# Stop
docker stop fastapi-sales-api

# Docker Compose
docker-compose up -d
docker-compose down
```

## 🔧 Requirements
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pandas==2.1.3
numpy==1.24.3
python-multipart==0.0.6
```

## 📊 Performance Features
- **Chunked CSV reading** (handles 600MB+ files)
- **Memory efficient** (never loads full file)
- **Async endpoints** for better concurrency
- **Thread pool execution** for background tasks
- **Configurable chunk sizes** based on available memory

## 🧪 Testing
```bash
# Install test dependencies
pip install pytest httpx

# Run tests
pytest tests/

# Health check
curl http://localhost:8000/ping
```

## 🚀 Deployment

### Production with Docker
```bash
# Build optimized image
docker build -t fastapi-sales-api:prod .

# Run with environment variables
docker run -d \
  -p 8000:8000 \
  -e LOG_LEVEL=INFO \
  -e CHUNK_SIZE=20000 \
  --restart unless-stopped \
  fastapi-sales-api:prod
```

### Kubernetes (Example)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastapi-sales-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: fastapi
        image: fastapi-sales-api:prod
        ports:
        - containerPort: 8000
```

## 📝 Logging
Logs are structured and configurable:
```python
# Change log level per request
curl "http://localhost:8000/ping?log_lvl=debug"

# Log output example:
# 2024-01-15 10:30:45 - app.api - INFO - Dataset ready.
# 2024-01-15 10:30:50 - app.api - DEBUG - Processed chunk 1
```

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 📄 License
MIT License - see LICENSE file for details

## 📞 Support
- Issues: [GitHub Issues](https://github.com/yourusername/fastapi-sales-api/issues)
- Documentation: `http://localhost:8000/docs`
- Email: your.email@example.com

---

**🚀 Ready to use?** 
1. Add your `business_sales.csv` to `app/dataset/`
2. Run `uvicorn app.api:app --reload`
3. Visit `http://localhost:8000/docs` to explore the API!

---

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](LICENSE)

---

**Copy this entire README.md to your repository root.**