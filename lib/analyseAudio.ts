import { z } from 'zod'

export const AudioAnalysisSchema = z.object({
  averageVolume: z.number().min(0).max(1),
  dominantPitch: z.number().min(0), // Raw frequency in Hz, no upper limit
  duration: z.number().positive(),
  pitchCoordinate: z.number().min(0).max(1),
  volumeCoordinate: z.number().min(0).max(1),
})

export type AudioAnalysis = z.infer<typeof AudioAnalysisSchema>

/**
 * Analyzes an audio file and extracts key characteristics
 * @param audioFile - The uploaded audio file
 * @returns Promise<AudioAnalysis> - Normalized audio features
 */
export async function analyzeAudio(audioFile: File): Promise<AudioAnalysis> {
  // Validate file type
  if (!audioFile.type.startsWith('audio/')) {
    throw new Error('Please upload a valid audio file')
  }

  // Create audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  try {
    // Convert file to array buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    
    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    // Get the first channel of audio data
    const audioData = audioBuffer.getChannelData(0)
    const sampleRate = audioBuffer.sampleRate
    const duration = audioBuffer.duration

    // Calculate average volume (RMS)
    const averageVolume = calculateRMS(audioData)
    
    // Calculate dominant pitch using FFT
    const dominantPitch = calculateDominantPitch(audioData, sampleRate)
    
    // Normalize values to 0-1 coordinates for grid mapping
    const volumeCoordinate = normalizeVolume(averageVolume)
    const pitchCoordinate = normalizePitch(dominantPitch)

    const analysis: AudioAnalysis = {
      averageVolume,
      dominantPitch,
      duration,
      pitchCoordinate,
      volumeCoordinate,
    }

    // Validate the analysis result
    return AudioAnalysisSchema.parse(analysis)

  } finally {
    // Clean up audio context
    await audioContext.close()
  }
}

/**
 * Calculate Root Mean Square (RMS) for volume analysis
 */
function calculateRMS(audioData: Float32Array): number {
  let sum = 0
  for (let i = 0; i < audioData.length; i++) {
    sum += audioData[i] * audioData[i]
  }
  return Math.sqrt(sum / audioData.length)
}

/**
 * Calculate dominant pitch using a simplified FFT approach
 * For a production app, you'd want to use a proper FFT library
 */
function calculateDominantPitch(audioData: Float32Array, sampleRate: number): number {
  // Simple zero-crossing rate method for basic pitch detection
  // This is a simplified approach - real pitch detection is more complex
  let zeroCrossings = 0
  
  for (let i = 1; i < audioData.length; i++) {
    if ((audioData[i-1] >= 0) !== (audioData[i] >= 0)) {
      zeroCrossings++
    }
  }
  
  // Estimate fundamental frequency from zero crossing rate
  const estimatedFrequency = (zeroCrossings * sampleRate) / (2 * audioData.length)
  
  return estimatedFrequency
}

/**
 * Normalize volume to 0-1 scale for grid mapping
 */
function normalizeVolume(rms: number): number {
  // RMS values typically range from 0 to ~0.5 for normal audio
  // We'll map this to 0-1 with some reasonable bounds
  const normalizedVolume = Math.min(rms * 4, 1.0) // Scale up and cap at 1
  return Math.max(normalizedVolume, 0.05) // Ensure minimum visibility
}

/**
 * Normalize pitch to 0-1 scale for grid mapping
 */
function normalizePitch(frequency: number): number {
  // Human voice and stomach rumbles typically range from ~80Hz to ~1000Hz
  // We'll map this logarithmically to 0-1
  const minFreq = 50  // Hz
  const maxFreq = 1000 // Hz
  
  const clampedFreq = Math.max(minFreq, Math.min(frequency, maxFreq))
  
  // Logarithmic scaling for better perception
  const logMin = Math.log(minFreq)
  const logMax = Math.log(maxFreq)
  const logFreq = Math.log(clampedFreq)
  
  return (logFreq - logMin) / (logMax - logMin)
}

/**
 * Create a visual representation of the waveform for UI feedback
 */
export function generateWaveformData(audioData: Float32Array, targetPoints: number = 100): number[] {
  const blockSize = Math.floor(audioData.length / targetPoints)
  const waveformData: number[] = []
  
  for (let i = 0; i < targetPoints; i++) {
    const start = i * blockSize
    const end = start + blockSize
    let sum = 0
    
    for (let j = start; j < end && j < audioData.length; j++) {
      sum += Math.abs(audioData[j])
    }
    
    waveformData.push(sum / blockSize)
  }
  
  return waveformData
} 