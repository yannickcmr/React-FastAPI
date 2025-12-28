import React, { useState } from 'react'
import FacilityLocation from '../FacilityLocation/FacilityLocation'
import DemandPoint from '../DemandPoint/DemandPoint'
import './WelcomeModal.css'

const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(true)
  const facilityExample = {
        "facilityID": 0,
        "location": [0,0],
        "connection": [0],
        "openingCosts": 1000
    }
    const demandExample = {
        "demandID": 0,
        "location": [0,0],
        "distance": 0
    }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="welcome-overlay" onClick={handleDismiss}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-header">
          <h1>Welcome to Facility Location Optimizer</h1>
          <p className="welcome-subtitle">Click anywhere to dismiss</p>
        </div>

        {/* Instructions */}
        <div className="welcome-card welcome-instructions">
          <h2>📍 How to Get Started</h2>
          <ul>
            <li><strong>Add Demand Points:</strong> Click on the map to add customer demand locations</li>
            <li><strong>Add Facilities:</strong> Click on the map to add facility locations</li>
            <li><strong>View Results:</strong> See real-time optimization results and cost analysis</li>
          </ul>
        </div>

        <br />

        <div className="welcome-grid">
          {/* Demand Points */}
          <div className="welcome-card welcome-component">
            <h3>📌 Demand Points</h3>
            <p>Represent customer locations that need to be served</p>
            <div className="component-preview">
              <DemandPoint demand={demandExample} onRemovePoint={x => {console.log('remove')}}/>
            </div>
            <p className="component-desc">Green markers on the map</p>
          </div>

          {/* Facilities */}
          <div className="welcome-card welcome-component">
            <h3>🏭 Facilities</h3>
            <p>Represent service facilities or warehouses</p>
            <div className="component-preview">
              <FacilityLocation facility={facilityExample} onRemovePoint={x => {console.log('remove')}}/>
            </div>
            <p className="component-desc">Blue markers on the map</p>
          </div>

          {/* Connections */}
          <div className="welcome-card welcome-component">
            <h3>🔗 Connections</h3>
            <p>Lines showing which facility serves each demand</p>
            <div className="component-preview">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <line x1="10" y1="10" x2="50" y2="50" stroke="#a1a9b2ff" strokeWidth="2" />
                <circle cx="10" cy="10" r="5" fill="#2563EB" />
                <circle cx="50" cy="50" r="5" fill="#3bdc26ff" />
              </svg>
            </div>
            <p className="component-desc">Gray lines on the map</p>
          </div>

          <br />

          {/* Tips */}
          <div className="welcome-card welcome-tips">
            <h2>💡 Tips</h2>
            <ul>
              <li>Use <strong>Euclidean</strong> or <strong>Manhattan</strong> distance metrics</li>
              <li>Adjust <strong>Opening Costs</strong> to balance facility placement</li>
              <li>In online mode, use <strong>Probability Bias</strong> to control randomness</li>
              <li>Double-click on markers to remove them</li>
            </ul>
          </div>
        </div>

        <div className="welcome-footer">
          <button className="welcome-button" onClick={handleDismiss}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal;