import React, { useRef, useState, useEffect, useCallback } from 'react'
import './ZoomMap.css'
import FacilityLocation from '../FacilityLocation/FacilityLocation'
import DemandPoint from '../DemandPoint/DemandPoint'

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
    const tolerance = 25
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
                borderRadius: '10%',
                border: isColliding ? '2px solid rgba(0, 255, 132, 1)' : '2px solid rgba(0, 221, 255, 1)',
                boxShadow: isColliding ? '0 0 15px rgba(0, 255, 132, 1), inset 0 0 10px rgba(0, 255, 132, 1)' : '0 0 15px rgba(0, 221, 255, 1), inset 0 0 10px rgba(0, 221, 255, 1)' ,
                transition: 'box-shadow 0.3s ease-in-out, border 0.3s ease-in-out',
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

          if (isColliding) {
            return <div key={`demand-${demand.demandID}`}></div>
          }

          return (
            <div
              key={`demand-${demand.demandID}`}
              style={{
                position: 'absolute',
                left: `${screenCoords.x}px`,
                top: `${screenCoords.y}px`,
                transform: isColliding
                  ? 'translate(-50%, -50%) translateX(20px)  translateZ(1)'
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
