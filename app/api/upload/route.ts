import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      }, { status: 400 })
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }

    // Convertir archivo a buffer
    const buffer = await file.arrayBuffer()
    
    // Subir a Pinata IPFS
    const pinataResponse = await uploadToPinata(buffer, file.name, file.type)
    
    if (!pinataResponse.success) {
      throw new Error(pinataResponse.error || 'Failed to upload to IPFS')
    }

    return NextResponse.json({
      success: true,
      ipfsHash: pinataResponse.ipfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${pinataResponse.ipfsHash}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 })
  }
}

async function uploadToPinata(
  fileBuffer: ArrayBuffer, 
  fileName: string, 
  contentType: string
): Promise<{ success: boolean; ipfsHash?: string; error?: string }> {
  try {
    const PINATA_API_KEY = process.env.PINATA_API_KEY
    const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API keys not configured')
    }

    // Crear FormData para Pinata
    const pinataFormData = new FormData()
    
    // Crear Blob del buffer
    const blob = new Blob([fileBuffer], { type: contentType })
    pinataFormData.append('file', blob, fileName)
    
    // Metadatos para Pinata
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        app: 'nearmint',
        type: 'nft-image',
        uploadedAt: new Date().toISOString()
      }
    })
    pinataFormData.append('pinataMetadata', metadata)
    
    // Opciones de Pinata
    const options = JSON.stringify({
      cidVersion: 1,
      wrapWithDirectory: false
    })
    pinataFormData.append('pinataOptions', options)

    // Subir a Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: pinataFormData
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Pinata API error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()
    
    return {
      success: true,
      ipfsHash: result.IpfsHash
    }

  } catch (error) {
    console.error('Pinata upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Endpoint para obtener información de un archivo IPFS
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ipfsHash = searchParams.get('hash')
    
    if (!ipfsHash) {
      return NextResponse.json({ error: 'IPFS hash required' }, { status: 400 })
    }

    // Verificar que el archivo existe en Pinata
    const PINATA_API_KEY = process.env.PINATA_API_KEY
    const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      return NextResponse.json({ error: 'Pinata API keys not configured' }, { status: 500 })
    }

    const response = await fetch(`https://api.pinata.cloud/data/pinList?hashContains=${ipfsHash}`, {
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to verify IPFS hash' }, { status: 404 })
    }

    const data = await response.json()
    
    if (data.count === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileInfo = data.rows[0]
    
    return NextResponse.json({
      success: true,
      ipfsHash: fileInfo.ipfs_pin_hash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${fileInfo.ipfs_pin_hash}`,
      fileName: fileInfo.metadata.name,
      fileSize: fileInfo.size,
      datePinned: fileInfo.date_pinned,
      metadata: fileInfo.metadata
    })

  } catch (error) {
    console.error('Error getting file info:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to get file info' 
    }, { status: 500 })
  }
}
