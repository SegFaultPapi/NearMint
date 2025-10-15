# 🔧 Corrección Basada en Documentación Oficial de ChipiSDK

## 📚 **Documentación de ChipiSDK**

### **useGetWallet**
```typescript
const { 
  getWalletAsync, 
  useGetWallet,
  data, 
  isLoading, 
  error 
} = useGetWallet();

// Parámetros:
// externalUserId (string): userId from your external provider
// bearerToken (string): Bearer token for authentication
```

### **useCreateWallet**
```typescript
const { 
  createWalletAsync, 
  data, 
  isLoading, 
  error 
} = useCreateWallet();

// Parámetros:
// pin (string): A user-defined code or password
// bearerToken (string): Bearer token for authentication
```

---

## ✅ **Correcciones Implementadas**

### **1. Hook Actualizado con Documentación Oficial**

**Archivo:** `hooks/use-nearmint-nft.ts`

#### **Cambios Principales:**

1. **Uso correcto de `useGetWallet`:**
   ```typescript
   const { getWalletAsync } = useGetWallet()
   ```

2. **Parámetros correctos para `getWalletAsync`:**
   ```typescript
   const walletInfo = await getWalletAsync({
     externalUserId: userId,  // ID del usuario de Clerk
     bearerToken,             // Token de autenticación
   })
   ```

3. **Importación de `userId` de Clerk:**
   ```typescript
   const { getToken, userId } = useAuth()
   ```

4. **Validación mejorada:**
   ```typescript
   if (!userId) {
     throw new Error("No se pudo obtener el ID del usuario")
   }
   
   if (!walletInfo || walletInfo.error) {
     throw new Error("No se pudo obtener la información de la wallet")
   }
   ```

### **2. Estructura Correcta de Parámetros**

```typescript
const result = await callAnyContractAsync({
  params: {
    contractAddress: NEARMINT_NFT_CONTRACT,
    entrypoint: 'mint',
    calldata: [],
    wallet: {
      publicKey: address,
      encryptedPrivateKey: walletInfo.encryptedPrivateKey,
    },
    encryptKey: walletInfo.encryptKey,
  },
  bearerToken,
})
```

### **3. Funciones Actualizadas**

- ✅ **`mintNFT()`** - Usa `getWalletAsync` con parámetros correctos
- ✅ **`mintBatchNFTs()`** - Usa `getWalletAsync` con parámetros correctos
- ✅ **Dependencias actualizadas** - Incluye `getWalletAsync` y `userId`

---

## 🎯 **Flujo Correcto**

### **1. Autenticación**
```typescript
const bearerToken = await getToken()
const userId = user?.id
```

### **2. Obtener Información de Wallet**
```typescript
const walletInfo = await getWalletAsync({
  externalUserId: userId,
  bearerToken,
})
```

### **3. Llamar al Contrato**
```typescript
const result = await callAnyContractAsync({
  params: {
    contractAddress: "...",
    entrypoint: "mint",
    calldata: [],
    wallet: {
      publicKey: address,
      encryptedPrivateKey: walletInfo.encryptedPrivateKey,
    },
    encryptKey: walletInfo.encryptKey,
  },
  bearerToken,
})
```

---

## 📋 **Información Requerida**

### **Para `getWalletAsync`:**
- **externalUserId**: ID del usuario de Clerk (`user.id`)
- **bearerToken**: Token de autenticación de Clerk

### **Para `callAnyContractAsync`:**
- **contractAddress**: Dirección del contrato NFT
- **entrypoint**: Nombre de la función del contrato
- **calldata**: Parámetros de la función
- **wallet.publicKey**: Dirección pública de la wallet
- **wallet.encryptedPrivateKey**: Clave privada encriptada
- **encryptKey**: PIN del usuario para desencriptar
- **bearerToken**: Token de autenticación de Clerk

---

## 🚀 **Resultado**

- ✅ **Documentación oficial** implementada correctamente
- ✅ **Parámetros correctos** para `getWalletAsync`
- ✅ **Validaciones mejoradas** para errores
- ✅ **Estructura de datos** según especificación de ChipiSDK
- ✅ **Sin errores de linting**

---

## 🔍 **Próximos Pasos**

1. **Probar la integración** - Usar `/test-nft` para verificar
2. **Verificar transacciones** - Confirmar en Starkscan
3. **Testing completo** - Probar flujo end-to-end

---

*Integración corregida según documentación oficial de ChipiSDK* ✅
