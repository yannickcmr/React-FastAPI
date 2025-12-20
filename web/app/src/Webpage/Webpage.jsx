import React, { useState, useCallback } from 'react'
import ZoomMap from '../Components/ZoomMap/ZoomMap'
import ExpandableMetric from '../Components/ExpandableMetric/ExpandableMetric'
import InfoModal from '../Components/InfoModal/InfoModal'
import { onlineFacilityLocation, offlineFacilityLocation } from '../api/api'
import './Webpage.css'

const Webpage = () => {
  const [optimizationModel, setOptimizationModel] = useState('online')
  const [metric, setMetric] = useState('euclidean')
  const [costs, setCosts] = useState(0)
  const [openingCosts, setOpeningCosts] = useState(1000)
  const [previousCosts, setPreviousCosts] = useState(0)
  const [costChange, setCostChange] = useState(0)
  const [probability, setProbability] = useState(1.0)
  const [iterations, setIterations] = useState(10)
  const [coinFlips, setCoinFlips] = useState([])
  const [currentCoin, setCurrentCoin] = useState(null)

  const [demands, setDemands] = useState([])
  const [facilities, setFacilities] = useState([])
  const [connections, setConnections] = useState([])

  const handleAddPoint = useCallback(async (pointType, location) => {
    try {
      if (pointType === 'demand') {
        const newDemand = {
          demandID: demands.length,
          location: [Math.round(location.x), Math.round(location.y)],
        }

        let result
        if (optimizationModel === 'online') {
          console.log("sending online (demand) request.")
          result = await onlineFacilityLocation(
            newDemand,
            demands,
            facilities,
            { probability, openingCosts, metric, iterations }
          )
          console.log("Received Online results.")
          console.log(result)
        } else {
          console.log("sending offline (demand) request.")
          result = await offlineFacilityLocation(
            [...demands, newDemand],
            facilities,
            { probability, openingCosts, metric, iterations }
          )
          console.log("Received Offline results.")
          console.log(result)
        }

        if (result.data) {
          setDemands(result.data.demands)
          setFacilities(result.data.facilities)
          setConnections(result.data.facilities)

          if (result.data.data.coin !== undefined) {
            setCurrentCoin(result.data.data.coin ? 'HEADS' : 'TAILS')
            setCoinFlips((prev) => [
              (result.data.data.coin ? '●' : '✕'),
              ...prev.slice(0, 15),
            ])
          }

          if (result.data.data.costs) {
            console.log(result.data.data.costs)
            setCosts(result.data.data.costs.current)
            setPreviousCosts(result.data.data.costs.previous)
            setCostChange(result.data.data.costs.delta)
          }
        }
      } else if (pointType === 'facility') {
        const newFacility = {
          facilityID: facilities.length,
          location: [Math.round(location.x), Math.round(location.y)],
          connection: [],
          openingCosts: openingCosts
        }
        setFacilities((prev) => [...prev, newFacility])

        if (optimizationModel === 'offline') {
          let result
          console.log("sending offline (facility) request.")

          result = await offlineFacilityLocation(
            demands,
            [...facilities, newFacility],
            { probability, openingCosts, metric, iterations }
          )
          console.log("Received Offline results.")
          console.log(result)

          if (result.data) {
            setDemands(result.data.demands)
            setFacilities(result.data.facilities)
            setConnections(result.data.facilities)

            if (result.data.data.costs) {
              console.log(result.data.data.costs)
              setCosts(result.data.data.costs.current)
              setPreviousCosts(result.data.data.costs.previous)
              setCostChange(result.data.data.costs.delta)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error adding point:', error)
    } finally {
      console.log(demands);
    }
  }, [demands, facilities, optimizationModel, probability, costs])

  const handleRemovePoint = useCallback((pointType, id) => {
    if (pointType === 'demand') {
      setDemands((prev) => prev.filter((d) => d.demandID !== id))
    } else if (pointType === 'facility') {
      setFacilities((prev) => prev.filter((f) => f.facilityID !== id))
    }
  }, [])

  const getCostDisplay = () => {
    return costs.toFixed(1)
  }

  const getCostChange = () => {
    if (costChange === 0) return 'No change'
    const symbol = costChange > 0 ? '+' : ''
    return `${symbol}${costChange.toFixed(1)}`
  }

  return (
    <div className="webpage">
      <ZoomMap
        demands={demands}
        facilities={facilities}
        connections={connections}
        onAddPoint={handleAddPoint}
        onRemovePoint={handleRemovePoint}
      />

      <div className="metrics-container">
        <ExpandableMetric
          title="Model"
          metric={optimizationModel === 'online' ? 'Online' : 'Offline'}
          subtitle={
            <div className="cost-info">
              <div className="cost-previous">{metric === 'euclidean' ? 'Euclidean' : 'Manhattan'}</div>
            </div>
          }
          expandedContent={
            <>
              <label className="metric-label" htmlFor="optimizationModel">Optimization Model</label>
              <select
                id='optimizationModel'
                value={optimizationModel}
                onChange={(e) => setOptimizationModel(e.target.value)}
                className="metric-select"
              >
                <option value="online">Online Algorithm</option>
                <option value="offline">Offline Algorithm</option>
              </select>

              <label className="metric-label" htmlFor="metric">Distance Metric</label>
              <select
                id='metric'
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="metric-select"
              >
                <option value="euclidean">Euclidean Norm</option>
                <option value="manhattan">Manhattan Norm</option>
              </select>
            </>
            
          }
        />

        <ExpandableMetric
          title="Costs"
          metric={getCostDisplay()}
          subtitle={
            <div className="cost-info">
              <div className="cost-previous">Previous: {previousCosts.toFixed(1)}</div>
              <div className="cost-change">{getCostChange()}</div>
            </div>
          }
          expandedContent={
            <>
            <label className="metric-label" htmlFor="openingCosts">Opening Costs</label>
            <input
              id='openingCosts'
              type="number"
              value={openingCosts}
              onChange={(e) => setOpeningCosts(parseFloat(e.target.value))}
              className="metric-input"
              step="0.1"
            />
            </>
          }
        />
        {optimizationModel === 'online' && (
          <ExpandableMetric
            title="Probability"
            metric={currentCoin || 'Not set'}
            subtitle={
              <div className="coin-history">
                {coinFlips.length > 0 ? (
                  <div className="coin-list">
                    {coinFlips.map((flip, idx) => (
                      <div key={idx} className="coin-item">
                        {flip}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="coin-empty">No flips yet</div>
                )}
              </div>
            }
            expandedContent={
              <div className="slider-container">
                <label className="metric-label" htmlFor="probability">Probability Bias</label>
                <input
                  id='probability'
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={probability}
                  onChange={(e) => setProbability(parseFloat(e.target.value))}
                  className="metric-slider"
                />
                <div className="slider-label">{(probability * 100).toFixed(0)}%</div>
              </div>
            }
          />
        )}

        {optimizationModel === 'offline' && (
          <ExpandableMetric
            title="Iteration"
            metric={iterations || 'Not set'}
            subtitle={<div></div>}
            expandedContent={
              <div className="slider-container">
                <label className="metric-label" htmlFor="iterations">Iterations</label>
                <input
                  id='iterations'
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={iterations}
                  onChange={(e) => setIterations(parseFloat(e.target.value))}
                  className="metric-slider"
                />
                <div className="slider-label">{(iterations).toFixed(0)}</div>
              </div>
            }
          />
        )}
        
      </div>

      <InfoModal />
    </div>
  )
}

export default Webpage;
