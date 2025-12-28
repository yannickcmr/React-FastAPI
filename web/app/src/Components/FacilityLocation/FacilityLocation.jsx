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

  // console.log("facility: ", facility);
  const totalConnections = facility.connection ? facility.connection.length : 0
  const totalCosts = facility.facilityCosts ? facility.facilityCosts.toFixed(1) : '0.0'
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
            </div>
          ) : (
            <div className="facility-connections-display">
              <div className="facility-metric">
                <span className="facility-metric-label">Connections</span>
                <span className="metric-value">{totalConnections}</span>
              </div>
              <div className="facility-metric">
                <span className="facility-metric-label">Opening:</span>
                <span className="metric-value">{openingCosts}</span>
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
