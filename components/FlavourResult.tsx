"use client"
// Results display component with flavour recommendation

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Flavour } from '@/data/flavours'
import { AudioAnalysis } from '@/lib/analyseAudio'

interface FlavourResultProps {
  flavour: Flavour
  audioAnalysis: AudioAnalysis
  onReset: () => void
}

export default function FlavourResult({ flavour, audioAnalysis, onReset }: FlavourResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Main Result Card */}
      <div className="bg-card border rounded-2xl p-8 text-center shadow-lg">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Flavour Image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative mx-auto w-64 h-80 rounded-xl overflow-hidden shadow-xl"
          >
            <Image
              src={flavour.imageUrl}
              alt={`${flavour.name} crisp packet`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Rumble Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {flavour.rumbleDescription}
            </h2>
            
            <h3 className="text-2xl font-semibold">
              {flavour.name}
            </h3>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {flavour.description}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Analysis Details */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 max-w-md mx-auto"
      >
        {/* Audio Analysis */}
        <div className="bg-card border rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-4 text-center">Your Rumble Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{audioAnalysis.duration.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume Level:</span>
              <span className="font-medium">
                {(audioAnalysis.volumeCoordinate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pitch Level:</span>
              <span className="font-medium">
                {(audioAnalysis.pitchCoordinate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dominant Frequency:</span>
              <span className="font-medium">
                {audioAnalysis.dominantPitch.toFixed(0)} Hz
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reset Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <button
          onClick={onReset}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Try Another Rumble
        </button>
      </motion.div>
    </motion.div>
  )
} 