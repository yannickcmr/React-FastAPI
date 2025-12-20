import React, { useRef, useState, useEffect, useCallback } from 'react'
import './ZoomMap.css'

const ZoomMap = ({ demands, facilities, connections, onAddPoint, onRemovePoint }) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
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

    // Draw demands (crosses)
    console.log("zoom", zoom, "linewidth", parseFloat(2 / zoom))
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 2 / zoom
    demands.forEach((demand) => {
      const isHovered =
        hoveredPoint?.type === 'demand' && hoveredPoint?.id === demand.demandID
      const radius = isHovered ? POINT_RADIUS + 2 : POINT_RADIUS

      // Draw cross
      ctx.beginPath()
      ctx.moveTo(demand.location[0] - radius, demand.location[1])
      ctx.lineTo(demand.location[0] + radius, demand.location[1])
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(demand.location[0], demand.location[1] - radius)
      ctx.lineTo(demand.location[0], demand.location[1] + radius)
      ctx.stroke()

      if (isHovered) {
        ctx.strokeStyle = '#f87171'
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.arc(demand.location[0], demand.location[1], radius + 5, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.strokeStyle = '#4ade80'
      }
    })

    // Draw facilities (circles)
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 2 / zoom
    facilities.forEach((facility) => {
      const isHovered =
        hoveredPoint?.type === 'facility' && hoveredPoint?.id === facility.facilityID
      const radius = isHovered ? POINT_RADIUS + 2 : POINT_RADIUS

      ctx.beginPath()
      ctx.arc(facility.location[0], facility.location[1], radius, 0, Math.PI * 2)
      ctx.stroke()

      if (isHovered) {
        ctx.strokeStyle = '#f87171'
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.arc(facility.location[0], facility.location[1], radius + 5, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.strokeStyle = '#fbbf24'
      }
    })

    ctx.restore()
  }, [offset, zoom, demands, facilities, connections, hoveredPoint])

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

  return (
    <div className="zoom-map-container" ref={containerRef}>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />

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

export default ZoomMap;
