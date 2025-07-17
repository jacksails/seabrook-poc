"use client"
// Main application page - Seabrook Rumble flavour predictor

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import AudioUploader from '@/components/AudioUploader'
import WaveformVisualizer from '@/components/WaveformVisualizer'
import FlavourResult from '@/components/FlavourResult'
import { analyzeAudio, generateWaveformData, type AudioAnalysis } from '@/lib/analyseAudio'
import { findClosestFlavour, type Flavour } from '@/data/flavours'

type AppState = 'upload' | 'processing' | 'result' | 'error'

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('upload')
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis | null>(null)
  const [recommendedFlavour, setRecommendedFlavour] = useState<Flavour | null>(null)
  const [waveformData, setWaveformData] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    setAppState('processing')
    setError(null)

    try {
      // Analyze the audio file
      const analysis = await analyzeAudio(file)
      
      // Find the closest flavour match
      const flavour = findClosestFlavour(analysis.pitchCoordinate, analysis.volumeCoordinate)
      
      // Generate waveform data for visualization (simplified)
      const audioBuffer = await file.arrayBuffer()
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const decodedAudio = await audioContext.decodeAudioData(audioBuffer)
      const waveform = generateWaveformData(decodedAudio.getChannelData(0))
      
      await audioContext.close()

      // Set results
      setAudioAnalysis(analysis)
      setRecommendedFlavour(flavour)
      setWaveformData(waveform)
      setAppState('result')

    } catch (err) {
      console.error('Audio analysis failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze audio')
      setAppState('error')
    }
  }, [])

  const handleReset = useCallback(() => {
    setAppState('upload')
    setAudioAnalysis(null)
    setRecommendedFlavour(null)
    setWaveformData(null)
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Seabrook Rumble
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your stomach rumble and discover your perfect Seabrook crisp flavour! 
            Britain&apos;s original crinkle cut meets advanced audio analysis.
          </p>
          <p className="text-lg text-muted-foreground/80 mt-2 font-medium">
            ✨ Brilliant by the bagful ✨
          </p>
        </motion.header>

        {/* Main Content */}
        <main className="space-y-8">
          {appState === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <AudioUploader
                onFileSelect={handleFileSelect}
                isProcessing={false}
              />
              
              {/* How it works */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-2xl font-semibold text-center mb-6">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-card border rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎤</span>
                    </div>
                    <h3 className="font-semibold mb-2">1. Upload Audio</h3>
                    <p className="text-sm text-muted-foreground">
                      Record or upload your stomach rumble (any audio format)
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-card border rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="font-semibold mb-2">2. Audio Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      We analyze pitch, volume, and duration using Web Audio API
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-card border rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🥔</span>
                    </div>
                    <h3 className="font-semibold mb-2">3. Flavour Match</h3>
                    <p className="text-sm text-muted-foreground">
                      Your rumble is mapped to our flavour grid for the perfect match
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {appState === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Analyzing Your Rumble...</h2>
                <p className="text-muted-foreground mb-8">
                  Our advanced audio processing is extracting the essence of your hunger
                </p>
              </div>
              
              <WaveformVisualizer isActive={true} />
              
              <div className="text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          {appState === 'result' && audioAnalysis && recommendedFlavour && (
            <FlavourResult
              flavour={recommendedFlavour}
              audioAnalysis={audioAnalysis}
              onReset={handleReset}
            />
          )}

          {appState === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">😵</span>
              </div>
              <h2 className="text-2xl font-semibold text-destructive">Oops! Something went wrong</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {error || 'We couldn\'t analyze your audio file. Please try again with a different file.'}
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>
            A fun proof of concept by{' '}
            <span className="font-medium">IMA</span>
          </p>
          <p className="mt-2">
            Web Audio API + The UK&apos;s original crinkle cut = Brilliant by the bagful! 🚀
          </p>
        </motion.footer>
      </div>
    </div>
  )
} 