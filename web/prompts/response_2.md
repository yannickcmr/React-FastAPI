# Complete Component Implementation

I'll provide you with all the necessary files to add these two marker components to your React application.

## 1. FacilityLocation.jsx

```jsx
import React, { useState } from 'react'
import './FacilityLocation.css'

const FacilityLocation = ({ facility, onDelete, onRemovePoint }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [state, setState] = useState('costs') // 'costs' or 'connections'

  const handleToggleState = () => {
    setState(state === 'costs' ? 'connections' : 'costs')
  }

  const handleDelete = () => {
    onRemovePoint('facility', facility.facilityID)
  }

  const totalConnections = facility.connection ? facility.connection.length : 0
  const totalCosts = facility.totalCosts ? facility.totalCosts.toFixed(1) : '0.0'
  const openingCosts = facility.openingCosts ? facility.openingCosts.toFixed(1) : '0.0'

  return (
    <div
      className="facility-location"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main Facility Marker */}
      <div
        className="facility-marker"
        onClick={handleToggleState}
        onDoubleClick={() => setIsExpanded(!isExpanded)}
        title="Click to toggle state, Double-click to expand"
      >
        {/* Pictogram - Building Icon */}
        <svg
          className="facility-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>

        {/* Center Display */}
        <div className="facility-display">
          {state === 'costs' ? (
            <div className="facility-cost-display">
              <div className="facility-main-value">{totalCosts}</div>
              <div className="facility-metric">
                <span className="metric-label">Opening:</span>
                <span className="metric-value">{openingCosts}</span>
              </div>
            </div>
          ) : (
            <div className="facility-connections-display">
              <div className="facility-main-value">{totalConnections}</div>
              <div className="facility-metric">
                <span className="metric-label">Connections</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="facility-tooltip">
          <div className="tooltip-title">Facility {facility.facilityID}</div>
          <div className="tooltip-content">
            <div className="tooltip-line">Location: ({facility.location[0]}, {facility.location[1]})</div>
            <div className="tooltip-line">Total Costs: {totalCosts}</div>
            <div className="tooltip-line">Connections: {totalConnections}</div>
          </div>
        </div>
      )}

      {/* Action Buttons - Expanded View */}
      {isExpanded && (
        <div className="facility-actions">
          <button
            className="action-button delete-button"
            onClick={handleDelete}
            title="Delete this facility"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default FacilityLocation
```

## 2. FacilityLocation.css

```css
.facility-location {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Facility Marker */
.facility-marker {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.15) 0%, rgba(74, 144, 226, 0.05) 100%);
  border: 2px solid rgba(74, 144, 226, 0.3);
  box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.1);
  animation: facilityShadow 2s infinite;
}

@keyframes facilityShadow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.1);
  }
  50% {
    box-shadow: 0 0 8px 2px rgba(74, 144, 226, 0.15);
  }
}

.facility-marker:hover {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.25) 0%, rgba(74, 144, 226, 0.1) 100%);
  border-color: rgba(74, 144, 226, 0.5);
  transform: scale(1.08);
}

.facility-marker:active {
  transform: scale(0.95);
}

/* Pictogram */
.facility-icon {
  position: absolute;
  width: 28px;
  height: 28px;
  color: rgba(74, 144, 226, 0.6);
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Center Display */
.facility-display {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.facility-cost-display,
.facility-connections-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 2px;
}

.facility-main-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.facility-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: 9px;
  color: var(--text-secondary);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.facility-marker:hover .facility-metric {
  opacity: 0.8;
}

.metric-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  font-size: 8px;
}

.metric-value {
  font-weight: 600;
  color: rgba(74, 144, 226, 0.8);
  font-size: 9px;
}

/* Tooltip */
.facility-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: rgba(45, 45, 45, 0.95);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  white-space: nowrap;
  z-index: 1000;
  font-size: 12px;
  color: var(--text-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  animation: tooltipFadeIn 0.2s ease;
  pointer-events: none;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(-8px);
  }
}

.tooltip-title {
  font-weight: 700;
  color: rgba(74, 144, 226, 0.9);
  margin-bottom: 4px;
  font-size: 11px;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tooltip-line {
  font-size: 11px;
  color: var(--text-secondary);
}

/* Action Buttons */
.facility-actions {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  animation: actionsSlideIn 0.3s ease;
}

@keyframes actionsSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.action-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(45, 45, 45, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-button:hover {
  background: rgba(45, 45, 45, 1);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-button svg {
  width: 16px;
  height: 16px;
}

.action-button.delete-button:hover {
  color: var(--danger-color);
  border-color: rgba(248, 113, 113, 0.3);
  background: rgba(248, 113, 113, 0.05);
}

/* Bento Framework - Card-like appearance */
.facility-marker {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.facility-marker:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
```

## 3. DemandPoint.jsx

```jsx
import React, { useState } from 'react'
import './DemandPoint.css'

const DemandPoint = ({ demand, onDelete, onRemovePoint }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDelete = () => {
    onRemovePoint('demand', demand.demandID)
  }

  const cost = demand.cost ? demand.cost.toFixed(1) : '0.0'

  return (
    <div
      className="demand-point"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main Demand Point Marker */}
      <div
        className="demand-marker"
        onDoubleClick={() => setIsExpanded(!isExpanded)}
        title="Double-click to expand"
      >
        {/* Pictogram - Pin/Location Icon */}
        <svg
          className="demand-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>

        {/* Center Display */}
        <div className="demand-display">
          <div className="demand-cost-display">
            <div className="demand-main-value">{cost}</div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="demand-tooltip">
          <div className="tooltip-title">Demand {demand.demandID}</div>
          <div className="tooltip-content">
            <div className="tooltip-line">Location: ({demand.location[0]}, {demand.location[1]})</div>
            <div className="tooltip-line">Cost: {cost}</div>
            {demand.assignedFacility !== undefined && (
              <div className="tooltip-line">Facility: {demand.assignedFacility}</div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons - Expanded View */}
      {isExpanded && (
        <div className="demand-actions">
          <button
            className="action-button delete-button"
            onClick={handleDelete}
            title="Delete this demand point"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default DemandPoint
```

## 4. DemandPoint.css

```css
.demand-point {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Demand Point Marker */
.demand-marker {
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(74, 226, 124, 0.15) 0%, rgba(74, 226, 124, 0.05) 100%);
  border: 2px solid rgba(74, 226, 124, 0.3);
  box-shadow: 0 0 0 0 rgba(74, 226, 124, 0.1);
  animation: demandShadow 2s infinite;
}

@keyframes demandShadow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(74, 226, 124, 0.1);
  }
  50% {
    box-shadow: 0 0 6px 1px rgba(74, 226, 124, 0.12);
  }
}

.demand-marker:hover {
  background: linear-gradient(135deg, rgba(74, 226, 124, 0.25) 0%, rgba(74, 226, 124, 0.1) 100%);
  border-color: rgba(74, 226, 124, 0.5);
  transform: scale(1.1);
}

.demand-marker:active {
  transform: scale(0.92);
}

/* Pictogram */
.demand-icon {
  position: absolute;
  width: 24px;
  height: 24px;
  color: rgba(74, 226, 124, 0.6);
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Center Display */
.demand-display {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.demand-cost-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.demand-main-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Tooltip */
.demand-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: rgba(45, 45, 45, 0.95);
  border: 1px solid rgba(74, 226, 124, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  white-space: nowrap;
  z-index: 1000;
  font-size: 12px;
  color: var(--text-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  animation: tooltipFadeIn 0.2s ease;
  pointer-events: none;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(-8px);
  }
}

.tooltip-title {
  font-weight: 700;
  color: rgba(74, 226, 124, 0.9);
  margin-bottom: 4px;
  font-size: 11px;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tooltip-line {
  font-size: 11px;
  color: var(--text-secondary);
}

/* Action Buttons */
.demand-actions {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  animation: actionsSlideIn 0.3s ease;
}

@keyframes actionsSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.action-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(45, 45, 45, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-button:hover {
  background: rgba(45, 45, 45, 1);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-button svg {
  width: 16px;
  height: 16px;
}

.action-button.delete-button:hover {
  color: var(--danger-color);
  border-color: rgba(248, 113, 113, 0.3);
  background: rgba(248, 113, 113, 0.05);
}

/* Bento Framework - Card-like appearance */
.demand-marker {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.demand-marker:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
```

## 5. Updated Webpage.jsx

Replace your current `Webpage.jsx` with this updated version:

```jsx
import React, { useState, useCallback } from 'react'
import ZoomMap from '../Components/ZoomMap/ZoomMap'
import ExpandableMetric from '../Components/ExpandableMetric/ExpandableMetric'
import InfoModal from '../Components/InfoModal/InfoModal'
import FacilityLocation from '../Components/FacilityLocation/FacilityLocation'
import DemandPoint from '../Components/DemandPoint/DemandPoint'
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
        markerComponents={{
          facility: FacilityLocation,
          demand: DemandPoint
        }}
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
```

## 6. Updated ZoomMap Integration (if using ZoomMap)

If you're using the markers in your `ZoomMap` component, make sure to render them with the position data:

```jsx
{facilities.map((facility) => (
  <div
    key={`facility-${facility.facilityID}`}
    style={{
      position: 'absolute',
      left: `${facility.location[0]}px`,
      top: `${facility.location[1]}px`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <FacilityLocation
      facility={facility}
      onRemovePoint={onRemovePoint}
    />
  </div>
))}

{demands.map((demand) => (
  <div
    key={`demand-${demand.demandID}`}
    style={{
      position: 'absolute',
      left: `${demand.location[0]}px`,
      top: `${demand.location[1]}px`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <DemandPoint
      demand={demand}
      onRemovePoint={onRemovePoint}
    />
  </div>
))}
```

## Features Summary

✅ **FacilityLocation Component:**
- Building icon pictogram
- Toggle between costs view and connections view
- Transparent metrics display
- Double-click to expand action menu
- Delete button with hover effects
- Hover tooltips with detailed information
- Animated shadow effect (pulsing)
- Minimalistic bento-style design

✅ **DemandPoint Component:**
- Pin/location icon pictogram
- Cost display in center
- Double-click to expand action menu
- Delete button with hover effects
- Hover tooltips with location and cost info
- Animated shadow effect
- Minimalistic bento-style design

✅ **Both Components:**
- Responsive hover states
- Smooth transitions and animations
- Color-coded (blue for facilities, green for demands)
- Transparent metrics for non-obstructive display
- Tooltip functionality with fade-in animation
- Proper z-index management
- Accessibility with title attributes

## 2.1
Here is the complete modified `ZoomMap.jsx` that integrates the new `FacilityLocation` and `DemandPoint` components:

```jsx
import React, { useRef, useState, useEffect, useCallback } from 'react'
import './ZoomMap.css'
import FacilityLocation from './FacilityLocation/FacilityLocation'
import DemandPoint from './DemandPoint/DemandPoint'

const ZoomMap = ({ demands, facilities, connections, onAddPoint, onRemovePoint }) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const markersContainerRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [selectedPointType, setSelectedPointType] = useState('demand')
  const [isDrawing, setIsDrawing] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const GRID_SIZE = 50
  const POINT_RADIUS = 8

  const getCanvasCoordinates = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left - offset.x) / zoom,
      y: (clientY - rect.top - offset.y) / zoom,
    }
  }, [offset, zoom])

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)

    ctx.strokeStyle = '#b0b0b0'
    ctx.lineWidth = 1 / zoom
    ctx.globalAlpha = 0.1

    const startX = Math.floor(-offset.x / zoom / GRID_SIZE) * GRID_SIZE
    const endX = startX + (canvas.width / zoom) + GRID_SIZE
    const startY = Math.floor(-offset.y / zoom / GRID_SIZE) * GRID_SIZE
    const endY = startY + (canvas.height / zoom) + GRID_SIZE

    for (let x = startX; x < endX; x += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(x, startY)
      ctx.lineTo(x, endY)
      ctx.stroke()
    }

    for (let y = startY; y < endY; y += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(endX, y)
      ctx.stroke()
    }

    ctx.globalAlpha = 1

    // Draw connections first (so they appear behind points)
    ctx.strokeStyle = '#b0b0b0'
    ctx.lineWidth = 2 / zoom
    ctx.globalAlpha = 0.4

    connections.forEach((facility) => {
      if (facility.connection && facility.connection.length > 0) {
        facility.connection.forEach((demandID) => {
          const demand = demands.find((d) => d.demandID === demandID)
          if (demand) {
            ctx.beginPath()
            ctx.moveTo(facility.location[0], facility.location[1])
            ctx.lineTo(demand.location[0], demand.location[1])
            ctx.stroke()
          }
        })
      }
    })

    ctx.globalAlpha = 1
    ctx.restore()
  }, [offset, zoom, demands, facilities, connections])

  useEffect(() => {
    drawGrid()
  }, [drawGrid])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta))
      const canvasRect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - canvasRect.left
      const mouseY = e.clientY - canvasRect.top

      setOffset((prev) => ({
        x: mouseX - ((mouseX - prev.x) * newZoom) / zoom,
        y: mouseY - ((mouseY - prev.y) * newZoom) / zoom,
      }))
      setZoom(newZoom)
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel, { passive: false })
  }, [zoom])

  const handleCanvasMouseDown = useCallback(
    (e) => {
      const coords = getCanvasCoordinates(e.clientX, e.clientY)

      // Check if clicking on existing point
      const clickedDemand = demands.find(
        (d) =>
          Math.hypot(d.location[0] - coords.x, d.location[1] - coords.y) <=
          POINT_RADIUS * 2 / zoom
      )

      const clickedFacility = facilities.find(
        (f) =>
          Math.hypot(f.location[0] - coords.x, f.location[1] - coords.y) <=
          POINT_RADIUS * 2 / zoom
      )

      if (e.button === 0) {
        // Left click
        if (clickedDemand || clickedFacility) {
          setIsDrawing(true)
          setDragStart({ x: e.clientX, y: e.clientY, type: 'pan' })
        } else {
          setIsDrawing(true)
          setDragStart({ x: e.clientX, y: e.clientY, type: 'place' })
        }
      } else if (e.button === 2) {
        // Right click - delete
        if (clickedDemand) {
          onRemovePoint('demand', clickedDemand.demandID)
        } else if (clickedFacility) {
          onRemovePoint('facility', clickedFacility.facilityID)
        }
      }
    },
    [demands, facilities, zoom, getCanvasCoordinates, onRemovePoint]
  )

  const handleCanvasMouseMove = useCallback(
    (e) => {
      const coords = getCanvasCoordinates(e.clientX, e.clientY)

      // Check for hovered points
      const hoveredDemand = demands.find(
        (d) =>
          Math.hypot(d.location[0] - coords.x, d.location[1] - coords.y) <=
          POINT_RADIUS * 3 / zoom
      )

      const hoveredFacility = facilities.find(
        (f) =>
          Math.hypot(f.location[0] - coords.x, f.location[1] - coords.y) <=
          POINT_RADIUS * 3 / zoom
      )

      if (hoveredDemand) {
        setHoveredPoint({ type: 'demand', id: hoveredDemand.demandID })
      } else if (hoveredFacility) {
        setHoveredPoint({ type: 'facility', id: hoveredFacility.facilityID })
      } else {
        setHoveredPoint(null)
      }

      if (isDrawing && dragStart) {
        if (dragStart.type === 'pan') {
          const dx = e.clientX - dragStart.x
          const dy = e.clientY - dragStart.y

          setOffset((prev) => ({
            x: prev.x + dx,
            y: prev.y + dy,
          }))

          setDragStart({ ...dragStart, x: e.clientX, y: e.clientY })
        }
      }
    },
    [demands, facilities, zoom, getCanvasCoordinates, isDrawing, dragStart]
  )

  const handleCanvasMouseUp = useCallback(
    (e) => {
      if (isDrawing && dragStart && dragStart.type === 'place') {
        const coords = getCanvasCoordinates(e.clientX, e.clientY)
        onAddPoint(selectedPointType, coords)
      }
      setIsDrawing(false)
      setDragStart(null)
      console.log("placed.")
    },
    [isDrawing, dragStart, selectedPointType, getCanvasCoordinates, onAddPoint]
  )

  const handleContextMenu = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('mousedown', handleCanvasMouseDown)
    canvas.addEventListener('mousemove', handleCanvasMouseMove)
    canvas.addEventListener('mouseup', handleCanvasMouseUp)
    canvas.addEventListener('contextmenu', handleContextMenu)

    return () => {
      canvas.removeEventListener('mousedown', handleCanvasMouseDown)
      canvas.removeEventListener('mousemove', handleCanvasMouseMove)
      canvas.removeEventListener('mouseup', handleCanvasMouseUp)
      canvas.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp])

  // Function to get screen coordinates from canvas coordinates
  const getScreenCoordinates = useCallback((canvasX, canvasY) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: canvasX * zoom + offset.x + rect.left,
      y: canvasY * zoom + offset.y + rect.top,
    }
  }, [offset, zoom])

  // Helper function to check if two points are at the same location
  const getCollidingPoints = useCallback((location, type) => {
    const tolerance = 5
    const collidingFacilities = facilities.filter(
      (f) =>
        Math.abs(f.location[0] - location[0]) < tolerance &&
        Math.abs(f.location[1] - location[1]) < tolerance
    )
    const collidingDemands = demands.filter(
      (d) =>
        Math.abs(d.location[0] - location[0]) < tolerance &&
        Math.abs(d.location[1] - location[1]) < tolerance
    )

    return {
      facilities: collidingFacilities,
      demands: collidingDemands,
    }
  }, [facilities, demands])

  return (
    <div className="zoom-map-container" ref={containerRef}>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />

      {/* Markers Container - Overlays on canvas */}
      <div
        className="markers-container"
        ref={markersContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Render Facilities */}
        {facilities.map((facility) => {
          const screenCoords = getScreenCoordinates(
            facility.location[0],
            facility.location[1]
          )
          const collidingPoints = getCollidingPoints(facility.location, 'facility')
          const isColliding = collidingPoints.demands.length > 0

          return (
            <div
              key={`facility-${facility.facilityID}`}
              style={{
                position: 'absolute',
                left: `${screenCoords.x}px`,
                top: `${screenCoords.y}px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
                zIndex: isColliding ? 100 : 50,
              }}
            >
              <FacilityLocation
                facility={facility}
                onRemovePoint={onRemovePoint}
              />
            </div>
          )
        })}

        {/* Render Demand Points */}
        {demands.map((demand) => {
          const screenCoords = getScreenCoordinates(
            demand.location[0],
            demand.location[1]
          )
          const collidingPoints = getCollidingPoints(demand.location, 'demand')
          const isColliding = collidingPoints.facilities.length > 0

          return (
            <div
              key={`demand-${demand.demandID}`}
              style={{
                position: 'absolute',
                left: `${screenCoords.x}px`,
                top: `${screenCoords.y}px`,
                transform: isColliding
                  ? 'translate(-50%, -50%) translateX(20px)'
                  : 'translate(-50%, -50%)',
                pointerEvents: 'auto',
                zIndex: isColliding ? 101 : 51,
                transition: 'transform 0.3s ease',
              }}
            >
              <DemandPoint
                demand={demand}
                onRemovePoint={onRemovePoint}
              />
            </div>
          )
        })}
      </div>

      <div className="point-selector">
        <button
          className={`selector-btn ${selectedPointType === 'demand' ? 'active' : ''}`}
          onClick={() => setSelectedPointType('demand')}
          title="Place Demand (Cross)"
        >
          ✕
        </button>
        <button
          className={`selector-btn ${selectedPointType === 'facility' ? 'active' : ''}`}
          onClick={() => setSelectedPointType('facility')}
          title="Place Facility (Circle)"
        >
          ●
        </button>
      </div>

      <div className="zoom-info">
        <div className="info-item">Zoom: {(zoom * 100).toFixed(0)}%</div>
        <div className="info-item">Offset: ({offset.x.toFixed(0)}, {offset.y.toFixed(0)})</div>
      </div>
    </div>
  )
}

export default ZoomMap
```

## Key Changes Made:

### 1. **Imports Added**
```jsx
import FacilityLocation from './FacilityLocation/FacilityLocation'
import DemandPoint from './DemandPoint/DemandPoint'
```

### 2. **New Utilities**

**`getScreenCoordinates()`** - Converts canvas coordinates to screen coordinates for proper positioning:
```jsx
const getScreenCoordinates = useCallback((canvasX, canvasY) => {
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()
  return {
    x: canvasX * zoom + offset.x + rect.left,
    y: canvasY * zoom + offset.y + rect.top,
  }
}, [offset, zoom])
```

**`getCollidingPoints()`** - Detects when facility and demand points are at the same location:
```jsx
const getCollidingPoints = useCallback((location, type) => {
  const tolerance = 5
  // Check if any facilities or demands are within tolerance distance
}, [facilities, demands])
```

### 3. **Markers Container**
Added a new overlay container with `pointerEvents: 'none'` that contains all the React component markers. This allows:
- Canvas drawing remains underneath
- Components are interactive (`pointerEvents: 'auto'` on individual markers)
- Proper z-index layering

### 4. **Component Rendering**
Both facilities and demands are rendered as React components with:
- Screen coordinate positioning (dynamically updated based on zoom/pan)
- Collision detection that offsets demand points when they overlap with facilities
- Dynamic z-index management (colliding components have higher z-index)
- Smooth transitions when components collide/separate

### 5. **Collision Handling**
When a facility and demand point occupy the same location:
- Demand point is translated 20px to the right
- z-index is increased so it appears on top
- Smooth 0.3s transition animation

## Features:

✅ Components follow zoom and pan in real-time  
✅ Overlapping markers are automatically offset  
✅ Canvas drawing (grid + connections) remains visible underneath  
✅ Interactive markers with proper event handling  
✅ Smooth animations during transforms  
✅ Fully responsive to all zoom levels  
✅ Maintains all original canvas functionality  

The components are now fully integrated and will respond to all user interactions (zoom, pan, collision detection, etc.) while maintaining the visual integrity of your application!
