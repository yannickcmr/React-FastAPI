""" File containing the FastAPI Description. """

APP_VERSION = "0.6.9"
DESCRIPTION = """ 
## React + FastAPI Example for the online Facility Location Problem.

---
### 🚀 Quick Start
This FastAPI implements some optimization algorithms such as the **Meyerson algorithm** for the online case as well as the **k-Means Clustering** algorithm for the offline facility location problem. In order to use the endpoints properly, please have a look at the two central classes, namely **Facility** and **Demand**. Both endpoints will return their optimal solution relative to the selected case.

---
### 🔍 Core Endpoints
| Endpoint | Method | Description | Parameters |
|:-------:|:-------:|:-------:|:-------:|
| / | GET | Welcome entry point | None |
| /ping |	GET |	Health check | log_lvl (optional) |
| /versions |	GET |	API version info |	log_lvl (optional) |
| /online_facility_location |	POST |	Solver for the Online Facility Location Problem using the Meyerson Algorithm |	log_lvl (optional) |
| /offline_facility_location |	POST |	Solver for the Offline Facility Location Problem using the k-Means Clustering Algorithm |	log_lvl (optional) |

"""
