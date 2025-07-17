"use client"
// Visual feedback component for audio processing

import React from 'react'
import { motion } from 'framer-motion'

interface WaveformVisualizerProps {
  waveformData?: number[]
  isActive?: boolean
}

export default function WaveformVisualizer({ waveformData, isActive = false }: WaveformVisualizerProps) {
  // Generate placeholder data if none provided
  const displayData = waveformData || Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.1)

  return (
    <div className="w-full h-24 flex items-end justify-center space-x-1 bg-muted/30 rounded-lg p-4 overflow-hidden">
      {displayData.map((amplitude, index) => (
        <motion.div
          key={index}
          className="bg-primary rounded-sm min-w-[2px]"
          style={{
            height: `${Math.max(amplitude * 100, 4)}%`,
            width: `${100 / displayData.length}%`,
          }}
          initial={{ scaleY: 0 }}
          animate={{ 
            scaleY: isActive ? [1, 1.2, 1] : 1,
            opacity: isActive ? [0.7, 1, 0.7] : 0.7
          }}
          transition={{
            duration: isActive ? 0.8 : 0.3,
            delay: index * 0.02,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
} 