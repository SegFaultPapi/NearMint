"use client"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink
} from "lucide-react"
import Image from "next/image"
import { useIPFSUpload, UploadResult } from "@/hooks/use-ipfs-upload"

interface UploadedFile {
  file: File
  result?: UploadResult
  preview?: string
}

interface IPFSUploaderProps {
  onUploadComplete?: (results: UploadResult[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxSize?: number // en MB
  className?: string
}

export function IPFSUploader({ 
  onUploadComplete, 
  maxFiles = 5, 
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize = 10,
  className = ""
}: IPFSUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadMultipleFiles, isUploading, uploadProgress } = useIPFSUpload()

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = []
    
    Array.from(files).forEach(file => {
      // Validar tipo de archivo
      if (!acceptedTypes.includes(file.type)) {
        alert(`Tipo de archivo no válido: ${file.type}. Solo se permiten: ${acceptedTypes.join(', ')}`)
        return
      }

      // Validar tamaño
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Archivo demasiado grande: ${file.name}. Máximo ${maxSize}MB`)
        return
      }

      // Validar cantidad máxima
      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        alert(`Máximo ${maxFiles} archivos permitidos`)
        return
      }

      // Crear preview para imágenes
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined

      newFiles.push({
        file,
        preview
      })
    })

    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [uploadedFiles.length, maxFiles, acceptedTypes, maxSize])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev]
      const file = newFiles[index]
      
      // Limpiar preview URL
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  const uploadFiles = useCallback(async () => {
    if (uploadedFiles.length === 0) return

    const files = uploadedFiles.map(uf => uf.file)
    const results = await uploadMultipleFiles(files)

    // Actualizar archivos con resultados
    setUploadedFiles(prev => 
      prev.map((uf, index) => ({
        ...uf,
        result: results[index]
      }))
    )

    // Llamar callback si se proporciona
    if (onUploadComplete) {
      onUploadComplete(results)
    }
  }, [uploadedFiles, uploadMultipleFiles, onUploadComplete])

  const clearAll = useCallback(() => {
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setUploadedFiles([])
  }, [uploadedFiles])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragOver 
            ? 'border-orange-500 bg-orange-500/10' 
            : 'border-gray-300 hover:border-orange-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Subir imágenes a IPFS
          </h3>
          <p className="text-gray-600 mb-4">
            Arrastra y suelta archivos aquí o haz clic para seleccionar
          </p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Tipos permitidos: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}</p>
            <p>Tamaño máximo: {maxSize}MB por archivo</p>
            <p>Máximo {maxFiles} archivos</p>
          </div>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Seleccionar Archivos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </Card>

      {/* Progress Bar */}
      {isUploading && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Subiendo archivos...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        </Card>
      )}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Archivos seleccionados ({uploadedFiles.length})</h4>
            <div className="flex gap-2">
              {!isUploading && (
                <>
                  <Button 
                    onClick={uploadFiles}
                    className="bg-green-500 hover:bg-green-600"
                    disabled={uploadedFiles.some(f => f.result)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Subir a IPFS
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearAll}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {uploadedFiles.map((uploadedFile, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                {/* Preview */}
                <div className="flex-shrink-0">
                  {uploadedFile.preview ? (
                    <Image
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {uploadedFile.result ? (
                    uploadedFile.result.success ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <Badge className="bg-green-100 text-green-800">
                          Subido
                        </Badge>
                        {uploadedFile.result.ipfsUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(uploadedFile.result!.ipfsUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <Badge className="bg-red-100 text-red-800">
                          Error
                        </Badge>
                      </div>
                    )
                  ) : isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
