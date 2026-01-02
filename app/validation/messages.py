""" File containing the default request BaseModels """

from pydantic import BaseModel, Field
from typing import Optional


""" Request Validation Classes """

class OnlineFacility(BaseModel):
    """ BaseModel for validating an online facility request. """
    demand: dict = Field(default={'demandID': 2, 'location': (3, -4)}, description="Current Demand Point")
    demands: list[dict] = Field(default=[{'demandID': 0, 'location': (0, 5)},{'demandID': 1, 'location': (-7, 2)}], description="Previous Demand Points")
    facilities: list[dict] = Field(default=[{'facilityID': 0, 'location': (0, 5), 'connection': [1, 2], 'openingCosts': 100.0}], description="Current Facilities")
    parameter: dict = Field(default={'probability': 1.0, "openingCosts": 10.0, 'costs': 1, 'metric': 'euclidean'}, description="Config for the Facility Location Problem.")

class OfflineFacility(BaseModel):
    """ BaseModel for validating an offline facility request. """
    demands: list[dict] = Field(..., description="Current Demand Points")
    facilities: list[dict] = Field(..., description="Current Facilities")
    parameter: dict = Field(default={'iterations': 10, 'costs': 1, "openingCosts": 10.0, 'metric': 'euclidean'}, description="Config for the Facility Location Problem.")


""" Response Validation Classes """

class MessageResponse(BaseModel):
    """ BaseModel for a default Message Response. """
    msg: str
    code: int
    data: Optional[dict] = None

class DataResponse(BaseModel):
    """ BaseModel for a default Data Response. """
    msg: str
    code: int
    data: dict

    def check_data(self) -> None:
        pass

class ErrorResponse(BaseModel):
    msg: str
    code: int = 400
    data: None = None
