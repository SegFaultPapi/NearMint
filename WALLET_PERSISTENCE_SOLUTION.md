# 🔐 Solución: Persistencia de Wallet con Clerk Metadata

## ✅ Problema Resuelto

**Problema:** Cuando el usuario cierra sesión y vuelve a iniciar sesión, se le pedía crear el PIN nuevamente.

**Causa:** El localStorage se limpia al cerrar sesión, y no había forma de saber si el usuario ya tenía una wallet creada.

**✅ Solución:** Usar **Clerk metadata** para persistir que el usuario tiene wallet entre sesiones.

---

## 🔧 Cómo Funciona

### 1. Al Crear la Wallet (Sign Up)

```javascript
// app/onboarding/create-pin/page.tsx

// Usuario completa PIN → ChipiSDK crea wallet
const wallet = await createWalletAsync({
  params: {
    encryptKey: pin,
    externalUserId: user.id,
  },
  bearerToken,
})

// Guardar en Clerk metadata
await user.update({
  unsafeMetadata: {
    hasWallet: true,
    walletAddress: wallet.wallet.publicKey,
    walletCreatedAt: new Date().toISOString(),
  }
})

// Guardar en localStorage también
localStorage.setItem("chipi_wallet_address", address)
localStorage.setItem("chipi_wallet_connected", "true")
localStorage.setItem("chipi_wallet_user_id", user.id)
```

### 2. Al Iniciar Sesión (Sign In)

```javascript
// contexts/wallet-context.tsx

const checkWalletStatus = async () => {
  // 1. Verificar localStorage primero (más rápido)
  const storedAddress = localStorage.getItem("chipi_wallet_address")
  if (storedAddress) {
    // Cargar desde localStorage
    return
  }

  // 2. Si no hay en localStorage, verificar Clerk metadata
  const clerkMetadata = user?.unsafeMetadata
  if (clerkMetadata?.hasWallet && clerkMetadata?.walletAddress) {
    // ♻️ Recuperar desde Clerk metadata
    // Restaurar en localStorage
    localStorage.setItem("chipi_wallet_address", address)
    localStorage.setItem("chipi_wallet_connected", "true")
  }
}
```

---

## 📊 Flujo Completo

### Primera Vez (Sign Up):
```
Usuario registra cuenta
    ↓
Completa PIN
    ↓
ChipiSDK crea wallet
    ↓
Guarda en:
├─ Clerk metadata ✅
└─ localStorage ✅
    ↓
Dashboard
```

### Login Posterior:
```
Usuario inicia sesión
    ↓
¿Tiene datos en localStorage?
├─ SÍ → Cargar y listo ✅
└─ NO → Verificar Clerk metadata
         ├─ SÍ → Recuperar y restaurar localStorage ♻️
         └─ NO → Pedir crear PIN (nuevo usuario)
```

---

## 🔒 Seguridad (Según ChipiSDK)

### ✅ Implementación Correcta:

1. **PIN solo client-side** ✅
   - El PIN se solicita en el navegador
   - ChipiSDK lo usa para encriptar
   - Nunca se envía raw al servidor

2. **No guardamos el PIN** ✅
   - Solo guardamos la dirección de la wallet
   - El PIN no se persiste en ningún lugar
   - ChipiSDK lo usa solo para encriptar

3. **Asociado con user session** ✅
   - Clerk metadata está ligado al usuario
   - Solo el usuario autenticado puede acceder

### 📝 Qué Guardamos:

#### En Clerk Metadata:
```javascript
{
  hasWallet: true,              // Flag simple
  walletAddress: "0x123...",    // Dirección pública
  walletCreatedAt: "2024-..."   // Timestamp
}
```

#### En localStorage:
```javascript
chipi_wallet_address: "0x123..."
chipi_wallet_connected: "true"
chipi_wallet_user_id: "user_abc123"
```

**NO guardamos:** El PIN, claves privadas, ni datos sensibles.

---

## 🧪 Testing

### Test 1: Usuario Nuevo
1. Sign Up
2. ✅ Pide PIN (una vez)
3. Completa PIN
4. ✅ Dashboard
5. **Cerrar sesión**
6. **Login nuevamente**
7. ✅ Dashboard directo (NO pide PIN) ← **ÉXITO**

### Test 2: Verificar Clerk Metadata

Después de crear wallet:

```javascript
// En consola del navegador:
// (Esto es solo para debug, NO en producción)

// Ver metadata del usuario
console.log(window.Clerk.user.unsafeMetadata)

// Debería mostrar:
{
  hasWallet: true,
  walletAddress: "0x...",
  walletCreatedAt: "2024-..."
}
```

### Test 3: Recuperación desde Clerk

1. Crear wallet
2. Abrir DevTools → Application → Local Storage
3. **Eliminar todas las keys `chipi_wallet_*`**
4. Recargar la página
5. ✅ La wallet se recupera automáticamente desde Clerk
6. Console log: `♻️ Recuperando wallet desde Clerk metadata`

### Test 4: Cambio de Usuario

1. Usuario A crea wallet
2. Cierra sesión
3. Usuario B inicia sesión (diferente cuenta)
4. ✅ No ve la wallet de Usuario A
5. ✅ Usuario B crea su propia wallet

---

## 🔍 Logs de Debug

### Logs Útiles:

```javascript
// Al cargar la app:
🔍 Verificando estado de wallet para usuario: user_abc123
📋 Clerk metadata: { hasWallet: true, walletAddress: "0x..." }
📦 Datos en localStorage: {...}

// Escenario 1: Tiene en localStorage
✅ Cargando wallet desde localStorage

// Escenario 2: Solo en Clerk metadata
♻️ Recuperando wallet desde Clerk metadata
✅ Wallet recuperada exitosamente

// Escenario 3: Usuario nuevo
❌ No se encontró wallet
```

---

## 💾 Ventajas de Usar Clerk Metadata

### ✅ Ventajas:

1. **No necesitas base de datos** adicional
2. **Persistencia automática** entre dispositivos
3. **Seguro** - Solo el usuario autenticado puede acceder
4. **Rápido** - Metadata se carga con el usuario
5. **Gratis** - Incluido en Clerk

### ⚠️ Consideraciones:

1. **Límite de 4KB** en unsafeMetadata (más que suficiente)
2. **Public metadata** es visible públicamente
3. **Unsafe metadata** solo visible para el usuario

**Usamos `unsafeMetadata`** porque:
- Solo el usuario autenticado puede leerlo
- No es público
- Perfecto para datos de sesión del usuario

---

## 🔄 Alternativa: Base de Datos

Si prefieres usar una base de datos propia:

```typescript
// app/api/wallet/check/route.ts
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db" // Tu BD

export async function GET() {
  const { userId } = await auth()
  
  const wallet = await db.wallets.findUnique({
    where: { userId }
  })
  
  return Response.json({
    hasWallet: !!wallet,
    address: wallet?.address
  })
}
```

Pero con Clerk metadata, **no necesitas esto**.

---

## 🚀 Próximos Pasos (Opcionales)

### 1. Recuperación de Wallet con ChipiSDK

Si el usuario pierde localStorage:

```typescript
// Usar ChipiSDK para recuperar wallet
const { getWallet } = useGetWallet()

const recoveredWallet = await getWallet({
  params: {
    externalUserId: user.id,
    encryptKey: pin, // Usuario debe ingresar PIN
  },
  bearerToken
})
```

### 2. Sincronización Multi-dispositivo

Con Clerk metadata, ya funciona automáticamente:
- Usuario crea wallet en Desktop → Guarda en Clerk
- Usuario inicia sesión en Mobile → Recupera de Clerk
- ✅ Misma wallet en todos los dispositivos

### 3. Backup de Seguridad

Opcional: Guardar también en tu backend:

```typescript
// Después de crear wallet
await fetch('/api/wallet/backup', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    address: wallet.wallet.publicKey,
    txHash: wallet.txHash
  })
})
```

---

## ✅ Checklist de Implementación

- [x] Guardar en Clerk metadata al crear wallet
- [x] Verificar Clerk metadata al login
- [x] Recuperar desde metadata si localStorage vacío
- [x] Logs de debug en consola
- [x] Limpiar datos de otros usuarios
- [x] Actualizar metadata desde contexto
- [ ] Testing en producción
- [ ] Documentar para el equipo

---

## 🎯 Resumen

### Antes:
```
Login → localStorage vacío → Pide PIN → 😡
```

### Ahora:
```
Sign Up → PIN (una vez) → Guarda en Clerk ✅
Login → Recupera de Clerk → Dashboard → 😊
```

**Solución:** Clerk metadata + localStorage
**PIN:** Solo se pide una vez
**Seguridad:** Cumple con ChipiSDK guidelines
**Base de datos:** No necesaria (pero puedes agregar)

---

¡La wallet ahora persiste correctamente entre sesiones! 🎉

