""" Router for calculation Endpoints """

from fastapi import APIRouter

from app.model.model import Demand, Facility
from app.model.online_facility import OnlineFacilitySolver
from app.model.offline_facility import OfflineFacilitySolver

from app.config.logging_config import create_logger
from app.validation.messages import OnlineFacility, OfflineFacility
from app.validation.messages import DataResponse, ErrorResponse


""" Logging Function """

Logger = create_logger()
Logger.info("=> Logging initialized.")


""" API """

router = APIRouter(tags=['calculation'])

@router.post("/online_facility_location", response_model=DataResponse | ErrorResponse)
def online_facility_location(data: OnlineFacility, log_lvl: str = "info") -> DataResponse | ErrorResponse:
    """ Endpoint for the online facility location problem.

    args:
        data (OnlineFacility): BaseModel containing the needed data.
        log_lvl (str, optional): Logger Level. Defaults to 'info'.

    Returns:
        DataResponse: Dict containing msg, code and data.
    """
    Logger.setLevel(log_lvl.upper())
    Logger.info(f"{'='*10} Received new Online Facility Location Task {'='*10} ")

    # initializing classes.
    try:
        demand = Demand().from_request(data.demand)
        demands = [Demand().from_request(x) for x in data.demands]
        facilities = [Facility().from_request(x, demands) for x in data.facilities]
        Logger.info("Initialized Classes")

    except Exception as e:
        Logger.warning(f"Could not initialize Classes: {e}")
        return ErrorResponse(msg=f"Could not initialize Classes: {e}")
    
    # initializing solver.
    try:
        solver = OnlineFacilitySolver(
            demands=demands,
            facilities=facilities,
            parameter=data.parameter,
            log_lvl=log_lvl
        )
        Logger.debug(f"{solver=}")
        Logger.info("Initialized Solver")

    except Exception as e:
        Logger.warning(f"Could not initialize Solver: {e}")
        return ErrorResponse(msg=f"Could not initialize Solver: {e}")


    # running Meyerson algorithm.
    try:
        solver.calculate_costs()
        solver.meyerson_algorithm(demand)
        result = solver.current_instance()
        result.pop('parameter')
        Logger.critical(f"{result=}")
        Logger.info("Meyerson Solver completed")

    except Exception as e:
        Logger.warning(f"Could not run Meyerson algorithm: {e}")
        return ErrorResponse(msg=f"Could not run Meyerson algorithm: {e}")

    return {
        "msg": "/online_facility_location successful.",
        "code": 200,
        "data": result
    }

@router.post("/offline_facility_location", response_model=DataResponse | ErrorResponse)
def offline_facility_location(data: OfflineFacility, log_lvl: str = "info") -> DataResponse | ErrorResponse:
    """ Endpoint for the offline facility location problem.

    args:
        data (OfflineFacility): BaseModel containing the needed data.
        log_lvl (str, optional): Logger Level. Defaults to 'info'.

    Returns:
        DataResponse: Dict containing msg, code and data.
    """
    Logger.setLevel(log_lvl.upper())
    Logger.info(f"{'='*10} Received new Online Facility Location Task {'='*10} ")

    # initializing classes.
    try:
        demands = [Demand().from_request(x) for x in data.demands]
        facilities = [Facility().from_request(x, demands) for x in data.facilities]
        Logger.info("Initialized Classes")

    except Exception as e:
        Logger.warning(f"Could not initialize Classes: {e}")
        return ErrorResponse(msg=f"Could not initialize Classes: {e}")
    
    # initializing solver.
    try:
        solver = OfflineFacilitySolver(
            demands=demands,
            facilities=facilities,
            parameter=data.parameter,
            log_lvl=log_lvl
        )
        Logger.debug(f"{solver=}")
        Logger.info("Initialized Solver")

    except Exception as e:
        Logger.warning(f"Could not initialize Solver: {e}")
        return ErrorResponse(msg=f"Could not initialize Solver: {e}")


    # running Meyerson algorithm.
    try:
        solver.calculate_costs()
        solver.cluster_algorithm()
        result = solver.current_instance()
        result.pop('parameter')
        Logger.critical(f"{result=}")
        Logger.info("Meyerson Solver completed")

    except Exception as e:
        Logger.warning(f"Could not run Meyerson algorithm: {e}")
        return ErrorResponse(msg=f"Could not run Clustering algorithm: {e}")

    return {
        "msg": "/offline_facility_location successful.",
        "code": 200,
        "data": result
    }
