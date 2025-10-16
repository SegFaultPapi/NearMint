"use client"

import { useState, useCallback } from "react"

export interface UploadResult {
  success: boolean
  ipfsHash?: string
  ipfsUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  error?: string
}

export function useIPFSUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadFile = useCallback(async (file: File): Promise<UploadResult> => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Validaciones del lado del cliente
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: 'Tipo de archivo no válido. Solo se permiten JPEG, PNG, GIF y WebP.'
        }
      }

      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'Archivo demasiado grande. El tamaño máximo es 10MB.'
        }
      }

      // Crear FormData
      const formData = new FormData()
      formData.append('file', file)

      // Simular progreso (ya que no tenemos progreso real de Pinata)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Subir archivo
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Error al subir archivo'
        }
      }

      return {
        success: true,
        ipfsHash: result.ipfsHash,
        ipfsUrl: result.ipfsUrl,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType
      }

    } catch (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al subir archivo'
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [])

  const uploadMultipleFiles = useCallback(async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = []
    
    for (const file of files) {
      const result = await uploadFile(file)
      results.push(result)
      
      // Si hay un error, detener el proceso
      if (!result.success) {
        break
      }
    }
    
    return results
  }, [uploadFile])

  const getFileInfo = useCallback(async (ipfsHash: string): Promise<UploadResult> => {
    try {
      const response = await fetch(`/api/upload?hash=${ipfsHash}`)
      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Error al obtener información del archivo'
        }
      }

      return {
        success: true,
        ipfsHash: result.ipfsHash,
        ipfsUrl: result.ipfsUrl,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType
      }

    } catch (error) {
      console.error('Error getting file info:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }, [])

  return {
    uploadFile,
    uploadMultipleFiles,
    getFileInfo,
    isUploading,
    uploadProgress
  }
}
