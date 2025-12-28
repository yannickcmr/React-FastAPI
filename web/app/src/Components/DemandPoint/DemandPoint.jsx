import React, { useState } from 'react'
import './DemandPoint.css'

const DemandPoint = ({ demand, onDelete, onRemovePoint }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDelete = () => {
    onRemovePoint('demand', demand.demandID)
  }
  
  // console.log("demand: ", demand);
  const cost = demand.distance ? demand.distance.toFixed(1) : '0.0'

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
