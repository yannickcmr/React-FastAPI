""" File for the Demand and Facility Classes """

import numpy as np

from config.logging_config import create_logger


""" Logger Function """

Logger = create_logger()
Logger.info("Logger initialized.")


""" Classes """

class Demand:
    def __init__(self, demandID: int = 0, location: tuple = (0, 0)):
        self.demandID = demandID
        self.location = location
    
    def log_demand(self) -> str:
        cache = f'[{self.demandID} @ {self.location}]'
        Logger.debug(f"{cache}")
        return cache

    def from_request(self, data: dict) -> 'Demand':
        """ Method to initialize a Demand instance from a request.

        Args:
            data (dict): Demand instance data.
        
        Returns:
            Demand: self instance.
        """
        # checking data for keys.
        for key in ['demandID', 'location']:
            if key not in data.keys():
                Logger.warning(f"Could not find [{key}] in Demand data.")
                return
        
        # assigning values from request data.
        self.demandID = data['demandID']
        self.location = data['location']

        return self

    def to_json(self) -> dict:
        return {
            'demandID': self.demandID,
            'location': self.location
        }

class Facility:
    def __init__(self, facilityID: int = 0, location: tuple = (0, 0), demands: list = None, openingCosts: float = 0.0):
        self.facilityID = facilityID
        self.location = location
        self.demands = demands if demands is not None else []
        self.openingCosts = openingCosts

    def log_facility(self) -> str:
        demand = [x.log_demand() for x in self.demands]
        cache = f"|{self.facilityID} @ {self.location}| serves {demand}"
        Logger.debug(f"{cache}")
        return cache

    def from_request(self, data: dict, demands: list[Demand] = None) -> 'Facility':
        """ Method to initialize a Demand instance from a request.

        Args:
            data (dict): Demand instance data.

        Returns:
            Facility: self instance.
        """
        # checking data for keys.
        for key in ['facilityID', 'location', 'connection', 'openingCosts']:
            if key not in data.keys():
                Logger.warning(f"Could not find [{key}] in Facility data.")
                return
        
        # assigning values from request data.
        self.facilityID = data['facilityID']
        self.location = data['location']
        self.openingCosts = data['openingCosts']

        if demands:
            cache = [x for x in demands if x.demandID in data['connection']]
            self.demands = cache

        return self

    def to_json(self) -> dict:
        return {
            'facilityID': self.facilityID,
            'location': self.location,
            'connection': [x.demandID for x in self.demands],
            'openingCosts': self.openingCosts
        }

    def check_demand(self, demand: Demand) -> bool:
        """ Method to check if the demand is already being served by the Facility.

        Args:
            demand (Demand): Demand Instance.

        Returns:
            bool: True if self serves Demand. False otherwise.
        """
        # checking if Demand is already in self.demand.
        current_demand = [x.demandID for x in self.demands]

        if demand.demandID in current_demand:
            return True
        return False

    def add_demand(self, demand: Demand) -> None:
        """ Method to add a Demand to the Facility.

        Args:
            demand (Demand): Demand Instance.
        """
        # checking Demand.
        if self.check_demand(demand):
            Logger.warning(f"Demand [{demand.demandID}] already served by Facility [{self.facilityID}]")
            return
        
        # adding Demand to self.
        self.demands.append(demand)
        Logger.debug(f"Demand [{demand.demandID}] assigned to Facility [{self.facilityID}]")

    def reset_demand(self) -> None:
        """ Method to reset self.demands to [].
        """
        self.demands = []
        Logger.debug(f"{self.demands=}")

    def calculate_distance(self, demand: Demand, metric: str = 'euclidean') -> float:
        """ Method to calculate the distance to a Demand.

        Args:
            demand (Demand): Demand Instance.
            metric (str, optional): Type of Metric to use. Defaults to 'euclidean'.

        Returns:
            float: Distance from self to the Demand.
        """
        # defining variables.
        demand_location = np.array(demand.location)
        facility_location = np.array(self.location)
        distance_location = facility_location - demand_location
        
        # calculating distance.
        match metric:
            case 'euclidean':
                return np.linalg.norm(distance_location)
            case 'manhattan':
                return np.linalg.norm(distance_location, ord=1)
            case _:
                Logger.warning(f"Could not match case [{metric}]")
                return -1.0


""" Testing """

if __name__ == "__main__":
    Logger.info("--> Running model.py")

    demand_1 = Demand(1, (1, 1))
    demand_2 = Demand(2, (-4, 0))
    demand_3 = Demand(3, (-1, 5))
    demand_4 = Demand(4, (10, 10))

    facility_1 = Facility(1, (0, 0))

    for demand in [demand_1, demand_2, demand_3, demand_4]:
        if facility_1.calculate_distance(demand) < 5.0:
            facility_1.add_demand(demand)
            Logger.info(f"Added Demand [{demand.demandID}] to Facility [{facility_1.facilityID}]")
        
        else:
            Logger.info(f"Demand [{demand.demandID}] too far from Facility [{facility_1.facilityID}]")
