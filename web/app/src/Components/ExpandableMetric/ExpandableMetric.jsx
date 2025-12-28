import React, { useState } from 'react'
import './ExpandableMetric.css'

const ExpandableMetric = ({ title, metric, subtitle, expandedContent, children }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`expandable-metric ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button
        className="metric-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="metric-title">{title}</div>
        <div className="metric-toggle">
          <svg
            className={`toggle-icon ${isExpanded ? 'rotated' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 10 13 14 9"></polyline>
          </svg>
        </div>
      </button>

      {!isExpanded && (
        <div className="metric-content">
          <div className="metric-value-metric">{metric}</div>
          {subtitle && <div className="metric-subtitle">{subtitle}</div>}
          {children && <div className="metric-children">{children}</div>}
        </div>
      )}

      {isExpanded && (
        <div className="metric-expanded">
          <div className="expanded-content">{expandedContent}</div>
        </div>
      )}
    </div>
  )
}

export default ExpandableMetric
