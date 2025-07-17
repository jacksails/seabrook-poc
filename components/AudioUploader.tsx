"use client"
// Interactive component for audio file uploads

import React, { useCallback, useState } from 'react'
import { Upload, FileAudio, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AudioUploaderProps {
  onFileSelect: (file: File) => void
  isProcessing: boolean
  disabled?: boolean
}

export default function AudioUploader({ onFileSelect, isProcessing, disabled }: AudioUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((file: File): boolean => {
    // Clear previous errors
    setError(null)

    // Check file type
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file (.wav, .mp3, .m4a, etc.)')
      return false
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 50MB')
      return false
    }

    return true
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      onFileSelect(file)
    }
  }, [onFileSelect, validateFile])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled || isProcessing) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [disabled, isProcessing, handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled && !isProcessing) {
      setIsDragOver(true)
    }
  }, [disabled, isProcessing])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }, [handleFileSelect])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          "hover:border-primary hover:bg-primary/5",
          isDragOver && "border-primary bg-primary/10 scale-[1.02]",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive bg-destructive/5"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          disabled={disabled || isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Upload audio file"
        />

        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          ) : (
            <motion.div
              animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {error ? (
                <FileAudio className="h-12 w-12 text-destructive" />
              ) : (
                <Upload className="h-12 w-12 text-muted-foreground" />
              )}
            </motion.div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isProcessing 
                ? "Analyzing your rumble..." 
                : isDragOver 
                  ? "Drop your audio file here" 
                  : "Upload your stomach rumble"
              }
            </h3>
            
            {!isProcessing && (
              <p className="text-sm text-muted-foreground">
                Drag and drop an audio file or click to browse
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Supports .wav, .mp3, .m4a and other audio formats (max 50MB)
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
          >
            <p className="text-sm text-destructive font-medium">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 