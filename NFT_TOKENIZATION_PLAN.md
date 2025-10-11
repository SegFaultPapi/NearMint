# 🎨 Plan de Tokenización NFT - NearMint MVP

## 📋 **Análisis del Proyecto**

### Concepto de NearMint:
**Plataforma de liquidez para coleccionables físicos**
- Tokenizar coleccionables (Pokemon, Baseball, Comics, etc.) como NFTs
- Usar NFTs como colateral para préstamos
- Marketplace para comprar/vender coleccionables tokenizados

### Flujo Actual (Mock):
1. ✅ Usuario sube fotos
2. ✅ Ingresa detalles (nombre, categoría, año, condición, valor)
3. ✅ Verificación con IA
4. ❌ **Tokenización (MOCK)** - Muestra "NEAR Protocol" pero no hay blockchain real

---

## 🔍 **Recursos Disponibles**

### ✅ **ChipiSDK v11.5.0 - Hooks disponibles:**
```typescript
- useApprove              // Aprobar tokens
- useCallAnyContract      // ⭐ CLAVE para NFTs
- useChipiContext         // Contexto global
- useCreateWallet         // Ya implementado
- useGetTokenBalance      // Ya implementado
- useGetWallet            // Info de wallet
- useRecordSendTransaction
- useStakeVesuUsdc
- useTransfer             // Transferir tokens
- useWithdrawVesuUsdc
```

### ❌ **NO disponible en ChipiSDK:**
- Hook específico para deploy de contratos
- Hook específico para mint de NFTs
- Integración IPFS nativa
- Gestión de metadata NFT

### ✅ **Red Actual:**
- **Starknet** (Cairo)
- Ya integrado con ChipiSDK
- Compatible con wallets custodiales

---

## 🎯 **Opciones de Implementación**

### **Opción 1: Contrato NFT Pre-Deployado (RECOMENDADO para MVP)**

**Pros:**
- ✅ Más rápido de implementar
- ✅ Gas fee solo al mintear
- ✅ Contrato verificado y testeado
- ✅ Enfoque en UX, no en infraestructura

**Contrato:**
- Deploy un contrato ERC721 en Starknet (una sola vez)
- Usar `useCallAnyContract` para mintear NFTs
- Metadata en IPFS o servidor centralizado (para MVP)

**Implementación:**
```typescript
// 1. Contrato Cairo (ERC721) deployado en Starknet
// 2. Función mint(to, tokenId, tokenURI)
// 3. useCallAnyContract para llamar mint()
```

**Tiempo estimado:** 2-3 días

---

### **Opción 2: Deploy dinámico por colección**

**Pros:**
- ✅ Cada tipo de coleccionable tiene su contrato
- ✅ Más flexible y escalable

**Contras:**
- ❌ Más complejo
- ❌ Gas fee por deploy
- ❌ ChipiSDK no tiene hook nativo para deploy

**Tiempo estimado:** 5-7 días

---

### **Opción 3: NFT Marketplace existente (OpenSea, Aspect)**

**Pros:**
- ✅ Infraestructura lista
- ✅ Sin desarrollo de contratos

**Contras:**
- ❌ Menos control
- ❌ Comisiones externas
- ❌ Experiencia "invisible web3" comprometida

---

## 🚀 **RECOMENDACIÓN: Opción 1 - MVP Rápido**

### **Stack Tecnológico:**
1. **Contrato NFT:** Cairo (ERC721 en Starknet)
2. **Interacción:** `useCallAnyContract` de ChipiSDK
3. **Metadata:** IPFS (Pinata/NFT.Storage) o servidor propio
4. **Storage:** Clerk `unsafeMetadata` para referencias
5. **Imágenes:** Cloudinary o S3 + IPFS

---

## 📝 **Plan de Implementación MVP**

### **Fase 1: Preparación (Día 1)**
- [ ] Deploy contrato ERC721 en Starknet Sepolia (testnet)
- [ ] Setup Pinata/NFT.Storage para metadata IPFS
- [ ] Setup Cloudinary para almacenar imágenes
- [ ] Definir estructura de metadata NFT

### **Fase 2: Backend/Servicios (Día 1-2)**
- [ ] API Route para subir imágenes a Cloudinary
- [ ] API Route para crear metadata JSON
- [ ] API Route para guardar en IPFS
- [ ] Función helper para `useCallAnyContract`

### **Fase 3: Frontend (Día 2-3)**
- [ ] Actualizar `/dashboard/tokenize` con lógica real
- [ ] Integrar upload de imágenes
- [ ] Integrar mint de NFT con ChipiSDK
- [ ] Guardar tokenId en Clerk metadata
- [ ] Mostrar NFT en colección del usuario

### **Fase 4: Testing (Día 3)**
- [ ] Probar flujo completo
- [ ] Verificar NFT en StarkScan
- [ ] Verificar metadata en IPFS
- [ ] Testing de errores y edge cases

---

## 🛠️ **Implementación Técnica Detallada**

### **1. Contrato Cairo (ERC721)**

```cairo
// Simplificado - Ya existe OZ implementation
#[starknet::contract]
mod NearMintCollectible {
    use openzeppelin::token::erc721::ERC721Component;
    
    #[storage]
    struct Storage {
        // ERC721 storage
    }
    
    // mint function
    fn mint(ref self: ContractState, to: ContractAddress, token_id: u256, token_uri: ByteArray) {
        // Mint logic
    }
}
```

**Dirección del contrato (ejemplo):**
```
0x1234...abcd (después de deploy)
```

---

### **2. Metadata NFT (OpenSea Standard)**

```json
{
  "name": "Charizard 1st Edition #001",
  "description": "1999 Pokémon Trading Card - Near Mint Condition",
  "image": "https://ipfs.io/ipfs/QmXxx...",
  "external_url": "https://nearmint.app/collectible/001",
  "attributes": [
    {
      "trait_type": "Category",
      "value": "Pokemon Cards"
    },
    {
      "trait_type": "Year",
      "value": "1999"
    },
    {
      "trait_type": "Condition",
      "value": "Near Mint"
    },
    {
      "trait_type": "Estimated Value",
      "value": "$5200"
    }
  ],
  "properties": {
    "creator": "0x...",
    "timestamp": "2025-01-10T...",
    "verificationStatus": "AI Verified"
  }
}
```

---

### **3. Integración con ChipiSDK**

```typescript
// components/nft-minter.tsx
import { useCallAnyContract } from "@chipi-stack/nextjs"
import { useAuth } from "@clerk/nextjs"

interface MintNFTParams {
  walletAddress: string
  tokenId: string
  metadataURI: string
}

export function useNFTMint() {
  const { getToken } = useAuth()
  const { callContractAsync, isLoading, error } = useCallAnyContract()

  const mintNFT = async ({ walletAddress, tokenId, metadataURI }: MintNFTParams) => {
    const bearerToken = await getToken()
    
    const result = await callContractAsync({
      params: {
        contractAddress: "0x...", // Tu contrato NFT
        entrypoint: "mint",
        calldata: [
          walletAddress,  // to
          tokenId,        // token_id
          metadataURI     // token_uri
        ],
        wallet: {
          publicKey: walletAddress,
          encryptedPrivateKey: "..." // From wallet context
        },
        encryptKey: "...", // PIN del usuario
      },
      bearerToken,
    })

    return result
  }

  return { mintNFT, isLoading, error }
}
```

---

### **4. API Routes**

```typescript
// app/api/collectibles/upload/route.ts
export async function POST(req: Request) {
  // 1. Recibir imágenes
  // 2. Subir a Cloudinary/IPFS
  // 3. Retornar URLs
}

// app/api/collectibles/metadata/route.ts
export async function POST(req: Request) {
  // 1. Crear JSON de metadata
  // 2. Subir a IPFS (Pinata)
  // 3. Retornar IPFS URI
}

// app/api/collectibles/mint/route.ts
export async function POST(req: Request) {
  // 1. Validar datos
  // 2. Generar tokenId único
  // 3. Llamar mint con ChipiSDK
  // 4. Guardar en Clerk metadata
  // 5. Retornar confirmación
}
```

---

### **5. Estructura en Clerk Metadata**

```typescript
// user.unsafeMetadata
{
  hasWallet: true,
  walletAddress: "0x...",
  collectibles: [
    {
      tokenId: "1",
      contractAddress: "0x...",
      name: "Charizard 1st Edition",
      category: "pokemon",
      image: "https://...",
      metadataURI: "ipfs://...",
      mintedAt: "2025-01-10T...",
      estimatedValue: 5200,
      status: "owned" // owned | listed | loaned
    }
  ],
  totalCollectibles: 1
}
```

---

## 💰 **Costos Estimados**

### Gas Fees (Starknet Testnet):
- Deploy contrato: ~$0 (testnet)
- Mint NFT: ~$0.10-0.50 por mint (testnet gratis)

### Servicios:
- **Pinata (IPFS):** Free tier (1GB)
- **Cloudinary:** Free tier (25GB)
- **Clerk:** Ya incluido
- **ChipiSDK:** Ya incluido

**Total MVP:** $0 (usando tiers gratuitos)

---

## 🎨 **Alternativa Simplificada (Si no quieres Cairo)**

### **Opción Rápida: Metadata On-Chain Mínima**

1. **No usar contrato propio:**
   - Usar contrato genérico de Starknet
   - Solo registrar hash de metadata
   
2. **Storage centralizado:**
   - Guardar todo en Clerk + Database
   - IPFS solo como backup
   
3. **"Tokenización simbólica":**
   - Generar tokenId único
   - No mintear en blockchain hasta que el usuario pida préstamo
   - MVP más rápido, menos blockchain

**Ventajas:**
- ✅ Implementación en 1 día
- ✅ Sin gas fees
- ✅ Más control

**Desventajas:**
- ❌ No es "realmente" tokenización
- ❌ No verificable on-chain
- ❌ Menos trust

---

## 🤔 **Pregunta para ti:**

**¿Qué enfoque prefieres para el MVP?**

1. **Full NFT (Opción 1):** 
   - Contrato real en Starknet
   - Metadata en IPFS
   - Mint real de NFTs
   - **Tiempo:** 2-3 días
   - **Complejidad:** Media

2. **Tokenización Simplificada:**
   - Solo storage en Clerk/DB
   - Sin blockchain real (por ahora)
   - **Tiempo:** 1 día
   - **Complejidad:** Baja

3. **Hybrid:**
   - Storage en Clerk
   - Mint opcional (solo si va a préstamo)
   - **Tiempo:** 1-2 días
   - **Complejidad:** Baja-Media

**Mi recomendación:** Empezar con **Opción 3 (Hybrid)** y escalar a Opción 1.

¿Qué opinas? 🎯


