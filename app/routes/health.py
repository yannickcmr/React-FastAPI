""" Router for default Endpoints """

from fastapi import APIRouter

from config.logging_config import create_logger
from validation.messages import MessageResponse
from config.documentation import APP_VERSION

""" Logging Function """

Logger = create_logger()
Logger.info("=> Logging initialized.")


""" API """

router = APIRouter(tags=['health'])

@router.get("/", response_model=MessageResponse)
def root() -> MessageResponse:
    """ Default Endpoint.

    Returns:
        MessageResponse: Dict containing welcome msg, code and data.
    """
    return {
        "msg": "Welcome to the React+FastAPI. Please visit http://localhost:8001/docs for more details.",
        "code": 200,
        "data": None
    }

@router.get("/ping")
def pong(log_lvl = "info") -> str:
    """ Endpoint for pinging.

    Args:
        log_lvl (str, optional): Logger level. Defaults to "info".

    Returns:
        str: pong
    """
    Logger.setLevel(log_lvl.upper())
    Logger.debug("pong")
    return "pong"

@router.get("/versions", response_model=MessageResponse)
def get_versions(log_lvl = "info") -> MessageResponse:
    """ Endpoint to get the current versions.

    Returns:
        dict: Dict containing code, msg and all current versions.
    """
    Logger.setLevel(log_lvl.upper())
    Logger.info(f"App Version [{APP_VERSION}]")

    return {
        'msg': "/version success.",
        'code': 200,
        'data': {
            'version': APP_VERSION
        }
    }
