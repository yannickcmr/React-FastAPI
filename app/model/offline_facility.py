""" File for The Offline Facility Location Solver """

import random as rnd
import numpy as np

from model.model import Demand, Facility
from config.logging_config import create_logger


""" Logger Function """

Logger = create_logger()
Logger.info("Logger initialized.")


""" Constants """

DEFAULT_PARAMETER = {
    'probability': 1.0,
    'costs': 100,
    'iterations': 10
}


""" Offline Facility Location Solver """

class OfflineFacilitySolver:
    def __init__(self, 
                 demands: list[Demand] = None,
                 facilities: list[Facility] = None,
                 parameter: dict = DEFAULT_PARAMETER,
                 log_lvl: str = "info"):
        Logger.setLevel(log_lvl.upper())

        self.demands = demands if demands is not None else []
        self.facilities = facilities if facilities is not None else []
        self.parameter = parameter

        self.costs = {'current': 0.0, 'previous': 0.0, 'delta': 0.0}

    def calculate_costs(self) -> dict:
        # calculating costs.
        previous = self.costs['current']
        current = 0.0
        for facility in self.facilities:
            current += facility.openingCosts

            for demand in facility.demands:
                current += facility.calculate_distance(demand, metric=self.parameter['metric'])

        # assigning costs.
        self.costs['current'] = current
        self.costs['previous'] = previous
        self.costs['delta'] = current - previous
        Logger.debug(f"Updated: {self.costs=}")

        return self.costs

    def open_facility(self, demand: Demand, openingCosts: float = 0.0) -> None:
        """ Method to open up a new Facility.

        Args:
            demand (Demand): Demand instance.
        """
        facility = Facility(facilityID=len(self.facilities),
                            location=demand.location,
                            openingCosts=openingCosts)
        facility.add_demand(demand)

        self.facilities.append(facility)
        self.demands.append(demand)
        Logger.info(f"Added Demand [{demand.demandID}] to new Facility [{facility.facilityID}]")

    def assign_facility(self, facility: Facility, demand: Demand) -> None:
        """ Method to assign a Demand instance to an existing Facility.

        Args:
            facility (Facility): Existing Facility from self.facility.
            demand (Demand): Demand instance.
        """
        facility.add_demand(demand)
        self.demands.append(demand)
        Logger.info(f"Assigned Demand [{demand.demandID}] to Facility [{facility.facilityID}]")

    def cluster_algorithm(self) -> None:
        for i in range(1, int(self.parameter['iterations']) + 1):
            Logger.debug(f"{'='*5} Clustering Round {i} {'='*5}")

            # resetting all connections.
            for facility in self.facilities:
                facility.reset_demand()

            # assigning each Demand to the nearest Facility.
            for demand in self.demands:
                distances = {x: x.calculate_distance(demand, metric=self.parameter['metric']) for x in self.facilities}
                Logger.debug(F"Distances: {distances}")

                facility, distance = min(distances.items(), key=lambda item: item[1])
                Logger.debug(f"Min: [{facility.facilityID}] -> {distance=}")

                facility.add_demand(demand)
                Logger.debug(f"Added Demand [{demand.demandID}] to Facility [{facility.facilityID}]")

            # calculating new Facility locations.
            for facility in self.facilities:
                if len(facility.demands) == 0:
                    continue

                cache = np.array([x.location for x in facility.demands])
                location = np.mean(cache, axis=0)
                facility.location = (location[0], location[1])
                Logger.debug(F"Facility [{facility.facilityID}] new Location: {facility.location}")

        # checking for cost improvement.
        costs = self.calculate_costs()
        Logger.debug(F"Current costs: {costs['current']}")

    def current_instance(self) -> dict:
        return {
            'demands': [x.to_json() for x in self.demands],
            'facilities': [x.to_json() for x in self.facilities],
            'parameter': self.parameter,
            'data': {
                'costs': self.costs
            }
        }

""" Testing """

if __name__ == "__main__":
    Logger.info("Running Online Facility Location Solver")

    test_demand = [Demand(demandID=i, location=(rnd.randint(-10, 10), rnd.randint(-10, 10))) for i in range(0, 5)]
    test_facility = [Facility(facilityID=i, location=(rnd.randint(-10, 10), rnd.randint(-10, 10))) for i in range(0, 2)]
    solver = OfflineFacilitySolver(test_demand, test_facility)
    solver.cluster_algorithm()

    for facility in solver.facility:
        Logger.info(f"{facility.log_facility()}")
