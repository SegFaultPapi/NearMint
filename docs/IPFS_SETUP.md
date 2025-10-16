# 📁 Configuración de IPFS con Pinata

## 🚀 Configuración Inicial

### 1. Crear cuenta en Pinata

1. Ve a [pinata.cloud](https://pinata.cloud)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Obtener API Keys

1. En el dashboard de Pinata, ve a **API Keys**
2. Haz clic en **New Key**
3. Configura:
   - **Key Name**: `nearmint-ipfs`
   - **Permissions**: 
     - ✅ `pinFileToIPFS` (subir archivos)
     - ✅ `pinList` (listar archivos)
     - ✅ `pinHashToIPFS` (opcional)
4. Copia las keys generadas:
   - **API Key**
   - **Secret Key**

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Pinata IPFS Configuration
PINATA_API_KEY=tu_api_key_aqui
PINATA_SECRET_KEY=tu_secret_key_aqui
```

## 🔧 Uso del Sistema

### Subir Imágenes

El sistema permite subir imágenes directamente a IPFS:

```typescript
// Usar el hook
const { uploadFile, isUploading } = useIPFSUpload()

// Subir archivo
const result = await uploadFile(file)
if (result.success) {
  console.log('IPFS URL:', result.ipfsUrl)
  console.log('IPFS Hash:', result.ipfsHash)
}
```

### Componente IPFSUploader

```tsx
<IPFSUploader 
  onUploadComplete={(results) => {
    console.log('Archivos subidos:', results)
  }}
  maxFiles={3}
  maxSize={10} // MB
/>
```

## 📋 Características

### ✅ Funcionalidades Implementadas

- **Subida a IPFS**: Archivos se almacenan en Pinata IPFS
- **Validación**: Tipos de archivo y tamaño máximo
- **Preview**: Vista previa de imágenes antes de subir
- **Progreso**: Barra de progreso durante la subida
- **Múltiples archivos**: Soporte para hasta 5 archivos
- **Drag & Drop**: Interfaz intuitiva de arrastrar y soltar
- **URLs permanentes**: Enlaces IPFS que nunca cambian

### 🎯 Tipos de Archivo Soportados

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)
- **WebP** (.webp)

### 📏 Límites

- **Tamaño máximo**: 10MB por archivo
- **Cantidad máxima**: 5 archivos por sesión
- **Gateway**: Pinata Gateway (rápido y confiable)

## 🔗 URLs de IPFS

Las imágenes se almacenan con URLs como:
```
https://gateway.pinata.cloud/ipfs/QmXxx...abc123
```

Estas URLs son:
- ✅ **Permanentes**: Nunca cambian
- ✅ **Descentralizadas**: Almacenadas en múltiples nodos
- ✅ **Accesibles**: Disponibles globalmente
- ✅ **Verificables**: Hash único para cada archivo

## 🛠️ API Endpoints

### POST `/api/upload`
Sube un archivo a IPFS

**Request:**
```javascript
const formData = new FormData()
formData.append('file', file)

fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

**Response:**
```json
{
  "success": true,
  "ipfsHash": "QmXxx...abc123",
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXxx...abc123",
  "fileName": "image.jpg",
  "fileSize": 1024000,
  "fileType": "image/jpeg"
}
```

### GET `/api/upload?hash=QmXxx...abc123`
Obtiene información de un archivo IPFS

**Response:**
```json
{
  "success": true,
  "ipfsHash": "QmXxx...abc123",
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXxx...abc123",
  "fileName": "image.jpg",
  "fileSize": 1024000,
  "datePinned": "2024-01-10T12:00:00Z"
}
```

## 🚨 Solución de Problemas

### Error: "Pinata API keys not configured"
- Verifica que las variables de entorno estén configuradas
- Reinicia el servidor después de agregar las variables

### Error: "File too large"
- Reduce el tamaño de la imagen
- Usa herramientas de compresión online

### Error: "Invalid file type"
- Solo se permiten imágenes (JPEG, PNG, GIF, WebP)
- Verifica la extensión del archivo

### Error: "Failed to upload to IPFS"
- Verifica tu conexión a internet
- Confirma que las API keys de Pinata sean válidas
- Revisa los límites de tu cuenta de Pinata

## 💰 Costos

### Pinata Gratuito
- **1GB** de almacenamiento
- **1000** pins por mes
- **Gateway** público incluido

### Pinata Pro ($20/mes)
- **100GB** de almacenamiento
- **Pins ilimitados**
- **Gateway** dedicado
- **API** sin límites

## 🔒 Seguridad

- Las API keys se almacenan solo en variables de entorno
- No se exponen en el código del cliente
- Validación de tipos de archivo en servidor y cliente
- Límites de tamaño para prevenir abuso
