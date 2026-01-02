""" File for The Online Facility Location Solver """

import random as rnd
import numpy as np

from app.model.model import Demand, Facility
from app.config.logging_config import create_logger


""" Logger Function """

Logger = create_logger()
Logger.info("Logger initialized.")


""" Constants """

DEFAULT_PARAMETER = {
    'probability': 1.0,
    'openingCosts': 100,
    'metric': 'euclidean'
}


""" Online Facility Location Solver """

class OnlineFacilitySolver:
    def __init__(self, 
                 demands: list[Demand] = None,
                 facilities: list[Facility] = None,
                 parameter: dict = DEFAULT_PARAMETER,
                 log_lvl: str = "info"):
        Logger.setLevel(log_lvl.upper())

        self.demands = demands if demands is not None else []
        self.facilities = facilities if facilities is not None else []
        self.parameter = parameter
        
        self.coin_flip = True
        self.costs = {'current': 0.0, 'previous': 0.0, 'delta': 0.0}

    def flip_coin(self, probability: float = 1.0) -> bool:
        """ Method to flip a (bias) coin.

        Args:
            probability (float, optional): Probability of the instance. Defaults to 1.0.

        Returns:
            bool: True if coin hits heads. False otherwise.
        """
        coin_flip = bool(rnd.random() < probability)
        self.coin_flip = coin_flip
        Logger.debug(f"{coin_flip=}")

        return coin_flip

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

    def meyerson_algorithm(self, demand: Demand) -> None:
        """ Method to assign a Demand in the Meyerson algorithmic way.

        Args:
            demand (Demand): Demand instance.
        """
        # checking for facilities.
        if len(self.facilities) == 0:
            self.open_facility(demand, self.parameter['openingCosts'])
            self.calculate_costs()
            return

        # finding nearest Facility.
        distances = {x: x.calculate_distance(demand, metric=self.parameter['metric']) for x in self.facilities}
        Logger.debug(f"Distance: {distances}")

        facility, distance = min(distances.items(), key=lambda item: item[1])
        Logger.debug(f"Min: [{facility.facilityID}] -> {distance=}")

        # calculating probability.
        probability = self.parameter['probability'] * (distance / self.parameter['openingCosts'])
        probability = np.around(probability, decimals=3)
        probability = np.min([probability, 1])
        Logger.debug(f"Probability: {probability}")

        # flipping the coin and assigning Demand.
        if self.flip_coin(probability):
            self.open_facility(demand, self.parameter['openingCosts'])

        else:
            self.assign_facility(facility, demand)
        
        # updating costs.
        costs = self.calculate_costs()
        Logger.debug(F"Current costs: {costs['current']}")

    def current_instance(self) -> dict:
        return {
            'demands': [x.to_json() for x in self.demands],
            'facilities': [x.to_json() for x in self.facilities],
            'parameter': self.parameter,
            'data': {
                'costs': self.costs,
                'coin': self.coin_flip
            }
        }


""" Testing """

if __name__ == "__main__":
    Logger.info("Running Online Facility Location Solver")

    test_demand = [Demand(demandID=i, location=(rnd.randint(-10, 10), rnd.randint(-10, 10))) for i in range(0, 5)]
    solver = OnlineFacilitySolver()

    for demand in test_demand:
        Logger.info(f"Current Demand: {demand.log_demand()}")
        solver.meyerson_algorithm(demand)

    for facility in solver.facility:
        Logger.info(f"{facility.log_facility()}")
