# 🚀 Flujo de Onboarding Automático con Wallet

## 📋 Resumen

Ahora cuando un usuario se registra, la wallet se crea **automáticamente** como parte del proceso de onboarding. El usuario solo necesita configurar su PIN de 4 dígitos.

---

## 🎯 Flujo Completo

### 1. Usuario hace clic en "Sign Up"
- Se muestra el formulario de Clerk
- Usuario ingresa email, contraseña, etc.

### 2. Clerk crea la cuenta
- Cuenta creada exitosamente
- Clerk redirige automáticamente a `/onboarding/create-pin`

### 3. Página de Configuración de PIN
**Ubicación:** `/app/onboarding/create-pin/page.tsx`

El usuario ve:
- ✅ Mensaje de bienvenida personalizado con su nombre
- ✅ Explicación de que se creará su wallet
- ✅ Formulario para PIN de 4 dígitos
- ✅ Confirmación de PIN

### 4. Creación Automática de Wallet
Cuando el usuario envía el formulario:
1. ✅ Valida el PIN (4 dígitos, coinciden)
2. ✅ Obtiene el token de autenticación de Clerk
3. ✅ Llama a `useCreateWallet` de ChipiSDK
4. ✅ Crea la wallet en Starknet
5. ✅ Guarda la dirección en el contexto y localStorage
6. ✅ Muestra pantalla de éxito
7. ✅ Redirige automáticamente al dashboard (3 segundos)

### 5. Usuario en el Dashboard
- ✅ Wallet lista para usar
- ✅ Puede ver su dirección
- ✅ Puede empezar a tokenizar coleccionables

---

## 🔧 Cambios Realizados

### 1. Nueva Página de Onboarding
```
📁 app/onboarding/create-pin/page.tsx
```

**Características:**
- UI moderna con efectos de glass y animaciones
- Validación en tiempo real del PIN
- Estados: setup → creating → success
- Redirección automática al dashboard
- Protección: Si ya tiene wallet, redirige al dashboard
- Protección: Si no está autenticado, redirige a sign-in

### 2. Layout Actualizado
```typescript
// app/layout.tsx
<ClerkProvider
  afterSignUpUrl="/onboarding/create-pin"  // ← Cambio aquí
  afterSignInUrl="/dashboard"
  ...
>
```

### 3. Variables de Entorno Actualizadas
```env
# .env y .env.example
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding/create-pin
```

---

## 🎨 UI/UX de la Página de Onboarding

### Estado 1: Setup del PIN
```
┌─────────────────────────────────────┐
│      ✨ (icono animado)              │
│  ¡Bienvenido, [Nombre]! 🎉          │
│  Último paso: configura tu PIN       │
│                                      │
│  🛡️ Tu Wallet Personal               │
│  Vamos a crear tu wallet...          │
│                                      │
│  PIN (4 dígitos): [••••]            │
│  Confirmar PIN:   [••••]            │
│                                      │
│  [Crear Mi Wallet] ←───────────────┐│
│                                      │
│  🔒 Guarda tu PIN en lugar seguro   │
└─────────────────────────────────────┘
```

### Estado 2: Creando Wallet
```
┌─────────────────────────────────────┐
│     ⏳ (spinner animado)             │
│                                      │
│     Creando tu Wallet                │
│  Configurando todo en Starknet...   │
│                                      │
│  Esto puede tomar unos segundos     │
│  No cierres esta ventana            │
└─────────────────────────────────────┘
```

### Estado 3: Éxito
```
┌─────────────────────────────────────┐
│      ✅ (icono rebotando)            │
│                                      │
│     ¡Wallet Creada! 🎉              │
│  Tu wallet ha sido configurada      │
│                                      │
│  📍 Dirección de Wallet:             │
│  [0x123...abc]                      │
│                                      │
│  ✅ Redirigiendo al dashboard...    │
│                                      │
│  Ver wallet desde el dashboard      │
└─────────────────────────────────────┘
```

---

## 🔐 Seguridad

### Validaciones Implementadas
1. ✅ PIN debe ser exactamente 4 dígitos numéricos
2. ✅ PIN y confirmación deben coincidir
3. ✅ Usuario debe estar autenticado con Clerk
4. ✅ Token de Clerk válido requerido
5. ✅ Si ya tiene wallet, no puede crear otra

### Protecciones
1. ✅ Redirect a `/sign-in` si no autenticado
2. ✅ Redirect a `/dashboard` si ya tiene wallet
3. ✅ No se puede cerrar durante la creación (advertencia)
4. ✅ Manejo completo de errores

---

## 📊 Manejo de Estados

### localStorage
```javascript
// Después de crear wallet:
chipi_wallet_address → "0x123..."
chipi_wallet_connected → "true"
```

### WalletContext
```javascript
{
  hasWallet: true,
  address: "0x123...",
  isConnected: true
}
```

---

## 🧪 Testing del Flujo

### Caso 1: Nuevo Usuario (Happy Path)
1. Ir a `/sign-up`
2. Registrarse con email/contraseña
3. Verificar redirección a `/onboarding/create-pin`
4. Ingresar PIN: `1234`
5. Confirmar PIN: `1234`
6. Click "Crear Mi Wallet"
7. ✅ Ver spinner "Creando tu Wallet"
8. ✅ Ver pantalla de éxito con dirección
9. ✅ Redirect automático a `/dashboard`
10. ✅ Verificar wallet en dashboard

### Caso 2: Usuario Ya Tiene Wallet
1. Usuario con wallet intenta ir a `/onboarding/create-pin`
2. ✅ Redirect automático a `/dashboard`

### Caso 3: Usuario No Autenticado
1. Usuario no autenticado intenta ir a `/onboarding/create-pin`
2. ✅ Redirect automático a `/sign-in`

### Caso 4: PINs No Coinciden
1. Ingresar PIN: `1234`
2. Confirmar PIN: `5678`
3. Click "Crear Mi Wallet"
4. ✅ Ver error: "Los PINs no coinciden"

### Caso 5: Error de ChipiSDK
1. ChipiSDK falla (red, API, etc)
2. ✅ Ver mensaje de error
3. ✅ Volver al estado "setup"
4. ✅ Usuario puede reintentar

---

## 🎯 Ventajas del Nuevo Flujo

### Para el Usuario
1. ✨ **Web3 Invisible** - No sabe que está usando blockchain
2. 🚀 **Rápido** - Solo 30 segundos para tener wallet
3. 🎯 **Simple** - Solo un PIN de 4 dígitos
4. 💪 **Sin fricción** - Parte del onboarding

### Para el Desarrollo
1. ✅ **Menos pasos manuales** - Automático
2. ✅ **Mayor conversión** - Integrado en sign-up
3. ✅ **Menos abandono** - Flujo continuo
4. ✅ **Mejor UX** - Experiencia cohesiva

---

## 🔄 Comparación: Antes vs Ahora

### ❌ ANTES
```
1. Usuario se registra
2. Va al dashboard (sin wallet)
3. Ve "Crear Wallet"
4. Click en botón
5. Dialog se abre
6. Configura PIN
7. Wallet creada
```
**Problema:** Usuario puede olvidar crear wallet o ignorar el botón

### ✅ AHORA
```
1. Usuario se registra
2. AUTOMÁTICAMENTE pide PIN
3. Wallet creada
4. Ya en dashboard con wallet lista
```
**Ventaja:** 100% de usuarios tienen wallet desde el inicio

---

## 📝 Próximos Pasos Opcionales

### 1. Guardar Wallet en Base de Datos
```typescript
// Después de crear wallet
await fetch('/api/wallet/save', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    address: wallet.wallet.publicKey,
    txHash: wallet.txHash,
    createdAt: new Date()
  })
})
```

### 2. Email de Confirmación
Enviar email al usuario con:
- ✅ Confirmación de wallet creada
- ✅ Dirección de wallet
- ✅ Link a StarkScan
- ✅ Recordatorio de guardar PIN

### 3. Backup del PIN
Permitir al usuario configurar recuperación:
- Pregunta de seguridad
- Email de recuperación
- Autenticación de 2 factores

### 4. Tutorial Interactivo
Después de crear wallet, mostrar:
- Tour del dashboard
- Cómo tokenizar primer item
- Cómo usar el marketplace

---

## 🐛 Troubleshooting

### Problema: "No se pudo obtener el token"
**Solución:**
```typescript
// Verificar que el usuario esté autenticado
const { user, isLoaded } = useUser()
if (!isLoaded || !user) {
  // Redirect a sign-in
}
```

### Problema: "Error al crear wallet"
**Causas posibles:**
1. API Key de ChipiSDK incorrecta
2. Red de Starknet caída
3. Usuario sin permisos

**Solución:**
- Verificar variables de entorno
- Ver console del navegador
- Revisar Network tab

### Problema: Redirect Loop
**Causa:** Usuario tiene wallet pero `hasWallet` es `false`

**Solución:**
```typescript
// Verificar localStorage
localStorage.getItem('chipi_wallet_address')
localStorage.getItem('chipi_wallet_connected')
```

---

## 📚 Recursos Relacionados

- [Documentación de ChipiSDK](https://docs.chipi.io)
- [Clerk Redirects](https://clerk.com/docs/advanced-usage/redirects)
- [StarkScan Explorer](https://starkscan.co)

---

## ✅ Checklist de Implementación

- [x] Crear página `/onboarding/create-pin`
- [x] Actualizar `afterSignUpUrl` en ClerkProvider
- [x] Actualizar variables de entorno
- [x] Validaciones de PIN
- [x] Manejo de errores
- [x] Estados de loading/success
- [x] Redirect automático al dashboard
- [x] Protecciones (autenticación, wallet existente)
- [ ] Testing en ambiente de producción
- [ ] Guardar wallet en base de datos
- [ ] Email de confirmación
- [ ] Analytics/tracking del flujo

---

🎉 **¡El flujo de onboarding automático está listo!** 

Los nuevos usuarios ahora tendrán su wallet creada automáticamente como parte del proceso de registro.

