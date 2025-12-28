import React, { useState } from 'react'
import FacilityLocation from '../FacilityLocation/FacilityLocation'
import DemandPoint from '../DemandPoint/DemandPoint'
import './InfoModal.css'

const InfoModal = () => {
  const [isOpen, setIsOpen] = useState(false)
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

  return (
    <>
      <button
        className="info-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Information"
        aria-label="Open information modal"
      >
        ⓘ
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="modal-body">
              <h1 className="modal-title">Facility Location Optimizer</h1>

              <div className="info-section">
                <h2>About</h2>
                <p>
                  This application implements optimization algorithms for the online and offline
                  facility location problem. Place demand points (green) and facilities
                  (blue) on the grid and visualize their optimal connections.
                </p>
              </div>

              <div className="info-section">
                <h2>Controls</h2>
                <ul className="controls-list">
                  <li>
                    <strong>Left Click:</strong> Place a point (select type in bottom left)
                  </li>
                  <li>
                    <strong>Double Click:</strong> Delete a point
                  </li>
                  <li>
                    <strong>Scroll:</strong> Zoom in and out
                  </li>
                </ul>
              </div>

              <div className="info-section">
                <h2>Legend</h2>
                <div className="legend-items">
                  <div className="legend-item">
                    <FacilityLocation  facility={facilityExample} onRemovePoint={x => {console.log('remove')}}/>
                    <span>Facility Point</span>
                  </div>
                  <div className="legend-item">
                    <DemandPoint demand={demandExample} onRemovePoint={x => {console.log('remove')}} />
                    <span>Demand Point</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h2>Contact</h2>
                <p>
                  For more information, visit:{' '}
                  <a
                    href="https://github.com/yannickcmr/React-FastAPI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-link"
                  >
                    GitHub Repository
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InfoModal
