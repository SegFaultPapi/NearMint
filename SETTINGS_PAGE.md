# ⚙️ Página de Configuración (Settings)

## ✅ Características Implementadas

### 🎯 Información del Usuario (Datos Reales)

#### Datos de Perfil:
- ✅ **Nombre y Apellido** - Obtenidos de Clerk
- ✅ **Email** - Email principal del usuario
- ✅ **ID de Usuario** - Clerk user ID
- ✅ **Dirección de Cuenta** - Wallet address real
  - Botón para copiar dirección
  - Botón para ver en StarkScan
  - Mensaje si no tiene wallet configurada

---

## 📋 Secciones

### 1. **Información de Perfil**

```typescript
Campos mostrados:
├─ Nombre: user.firstName
├─ Apellido: user.lastName
├─ Email: user.emailAddresses[0].emailAddress
├─ ID de Usuario: user.id
└─ Dirección de Cuenta: address (desde WalletContext)
```

**Características:**
- Todos los campos son read-only (Clerk gestiona los cambios)
- La dirección de wallet se puede copiar con 1 click
- Link directo a StarkScan Explorer
- Si no tiene wallet, muestra mensaje de alerta

---

### 2. **Notificaciones** (Configurables)

```typescript
Opciones disponibles:
├─ Recordatorios de Préstamos ✓
├─ Actualizaciones del Marketplace ✓
├─ Alertas de Precio ✗
└─ Notificaciones por Email ✓
```

**Switches interactivos:**
- Cada switch actualiza el state local
- Se guardan en Clerk metadata al hacer clic en "Guardar Cambios"
- Los cambios persisten entre sesiones

**Valores por defecto:**
- Recordatorios de Préstamos: `true`
- Actualizaciones del Marketplace: `true`
- Alertas de Precio: `false`
- Notificaciones por Email: `true`

---

### 3. **Preferencias** (Configurables)

#### Idioma:
```
Opciones:
- Español (es) ← Default
- English (en)
- Português (pt)
```

#### Moneda:
```
Opciones:
- USD - Dólar Estadounidense ← Default
- MXN - Peso Mexicano
- COP - Peso Colombiano
- ARS - Peso Argentino
- BRL - Real Brasileño
- EUR - Euro
```

#### Tema:
```
Opciones:
- Oscuro (dark) ← Default
- Claro (light)
- Automático (auto)
```

---

## 💾 Persistencia de Configuraciones

### Guardar en Clerk Metadata:

```typescript
await user.update({
  unsafeMetadata: {
    ...user.unsafeMetadata,
    settings: {
      notifications: {
        loanReminders: true,
        marketplaceUpdates: true,
        priceAlerts: false,
        emailNotifications: true
      },
      preferences: {
        language: "es",
        currency: "USD",
        theme: "dark"
      }
    }
  }
})
```

### Cargar Configuraciones:

```typescript
useEffect(() => {
  if (user?.unsafeMetadata?.settings) {
    setSettings(user.unsafeMetadata.settings as UserSettings)
  } else {
    setSettings(defaultSettings) // Usar defaults
  }
}, [user])
```

---

## 🎨 Tarjetas Laterales (Quick Info)

### Card 1: Seguridad
```
├─ Estado de Cuenta: Protegida / Sin Proteger
├─ Autenticación: Clerk
└─ Cuenta Creada: [Fecha]
```

### Card 2: Cuenta Digital
```
Si tiene wallet:
├─ Dirección: 0x123...abc
├─ Red: Starknet
└─ [Botón: Ver Detalles]

Si NO tiene wallet:
├─ Mensaje: "No configurada"
└─ [Botón: Configurar Ahora]
```

### Card 3: Resumen
```
├─ Idioma: Español
├─ Moneda: USD
└─ Notificaciones: X de 4
```

---

## 🔧 Funcionalidades

### 1. **Copiar Dirección de Wallet**
```typescript
const handleCopy = () => {
  navigator.clipboard.writeText(address)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}
```
- Click en botón → Copia al clipboard
- Muestra ✓ por 2 segundos
- Vuelve al ícono de copiar

### 2. **Ver en Explorer**
```typescript
onClick={() => window.open(
  `https://starkscan.co/contract/${address}`, 
  '_blank'
)}
```
- Abre StarkScan en nueva pestaña
- Muestra el contrato de la wallet

### 3. **Guardar Configuraciones**
```typescript
const handleSaveSettings = async () => {
  await user.update({
    unsafeMetadata: { ...user.unsafeMetadata, settings }
  })
  // Muestra mensaje de éxito
}
```
- Botón muestra diferentes estados:
  - Normal: "Guardar Cambios"
  - Loading: "Guardando..."
  - Success: "✓ Guardado" (3 segundos)

---

## 📊 Estado de la UI

### Botón de Guardar:

**Estados:**
```typescript
isSaving = false, saveSuccess = false
→ "💾 Guardar Cambios"

isSaving = true
→ "Guardando..."

isSaving = false, saveSuccess = true
→ "✓ Guardado"
```

**Feedback visual:**
- Botón deshabilitado mientras guarda
- Ícono de check cuando se guarda exitosamente
- Vuelve al estado normal después de 3 segundos

---

## 🎯 Valores por Defecto

### Si no hay configuraciones guardadas:

```typescript
const defaultSettings: UserSettings = {
  notifications: {
    loanReminders: true,
    marketplaceUpdates: true,
    priceAlerts: false,
    emailNotifications: true,
  },
  preferences: {
    language: "es",
    currency: "USD",
    theme: "dark",
  },
}
```

**Estos defaults se aplican:**
- Primera vez que el usuario visita Settings
- Si Clerk metadata no tiene `settings`
- Garantizan que siempre hay valores válidos

---

## 🔄 Flujo de Usuario

### Primera Visita:
```
Usuario entra a Settings
    ↓
Sistema carga defaults
    ↓
Usuario ve configuración inicial
    ↓
Usuario cambia algunos valores
    ↓
Click en "Guardar Cambios"
    ↓
Guarda en Clerk metadata
    ↓
Feedback visual: "✓ Guardado"
```

### Visitas Posteriores:
```
Usuario entra a Settings
    ↓
Sistema carga desde Clerk metadata
    ↓
Usuario ve sus configuraciones guardadas
    ↓
[Puede cambiar y guardar nuevamente]
```

---

## 🧪 Testing

### Test 1: Ver Información de Perfil
1. Login con tu cuenta
2. Ve a `/dashboard/settings`
3. ✅ Verifica que se muestre tu nombre real
4. ✅ Verifica que se muestre tu email real
5. ✅ Si tienes wallet, verifica que se muestre la dirección

### Test 2: Cambiar Notificaciones
1. En Settings, cambia algunos switches
2. Click en "Guardar Cambios"
3. ✅ Debe mostrar "✓ Guardado"
4. Recarga la página
5. ✅ Los cambios deben persistir

### Test 3: Cambiar Preferencias
1. Cambia idioma a "English"
2. Cambia moneda a "MXN"
3. Click en "Guardar Cambios"
4. ✅ Debe mostrar "✓ Guardado"
5. Cierra sesión y vuelve a entrar
6. ✅ Las preferencias deben estar guardadas

### Test 4: Copiar Wallet
1. Si tienes wallet configurada
2. Click en botón de copiar
3. ✅ Debe cambiar a ícono de check
4. Pega en otro lugar (Ctrl+V)
5. ✅ Debe pegar la dirección completa

### Test 5: Ver en Explorer
1. Click en botón de Explorer
2. ✅ Debe abrir StarkScan en nueva pestaña
3. ✅ Debe mostrar tu contrato

---

## 📝 Estructura de Datos

### TypeScript Interfaces:

```typescript
interface UserSettings {
  notifications: {
    loanReminders: boolean
    marketplaceUpdates: boolean
    priceAlerts: boolean
    emailNotifications: boolean
  }
  preferences: {
    language: string
    currency: string
    theme: string
  }
}
```

### En Clerk Metadata:

```json
{
  "hasWallet": true,
  "walletAddress": "0x123...",
  "settings": {
    "notifications": {
      "loanReminders": true,
      "marketplaceUpdates": false,
      "priceAlerts": false,
      "emailNotifications": true
    },
    "preferences": {
      "language": "es",
      "currency": "USD",
      "theme": "dark"
    }
  }
}
```

---

## 🎨 UI/UX

### Diseño Responsive:
- ✅ Desktop: 2 columnas (principal + sidebar)
- ✅ Mobile: 1 columna (stack vertical)
- ✅ Inputs y selects se adaptan al ancho

### Colores:
- **Seguridad:** Púrpura (`bg-purple-500/20`)
- **Wallet:** Verde (`bg-green-500/20`)
- **Notificaciones:** Cyan (`bg-cyan-500/20`)
- **Preferencias:** Púrpura (`bg-purple-500/20`)
- **Resumen:** Cyan (`bg-cyan-500/20`)

### Feedback Visual:
- ✅ Switches animados
- ✅ Hover effects en todos los elementos interactivos
- ✅ Loading states
- ✅ Success states
- ✅ Transiciones suaves

---

## 🚀 Próximas Mejoras (Opcionales)

### 1. Foto de Perfil
```typescript
// Clerk soporta avatars
<img 
  src={user?.imageUrl} 
  alt="Profile" 
  className="w-16 h-16 rounded-full"
/>
```

### 2. Editar Nombre
```typescript
// Permitir editar firstName/lastName
await user.update({
  firstName: newFirstName,
  lastName: newLastName
})
```

### 3. Cambiar Tema en Tiempo Real
```typescript
// Aplicar el tema seleccionado
if (settings.preferences.theme === 'light') {
  document.documentElement.classList.add('light-mode')
}
```

### 4. Validación de Email
```typescript
// Verificar si el email está verificado
const isVerified = user?.emailAddresses[0]?.verification?.status === 'verified'
```

---

## ✅ Checklist

- [x] Mostrar información real del usuario
- [x] Mostrar dirección de wallet
- [x] Botón copiar wallet
- [x] Botón ver en explorer
- [x] Configuraciones de notificaciones
- [x] Configuraciones de preferencias
- [x] Guardar en Clerk metadata
- [x] Cargar desde Clerk metadata
- [x] Valores por defecto
- [x] Feedback visual al guardar
- [x] Cards laterales informativas
- [x] Responsive design
- [x] Sin errores de linter

---

¡La página de Settings está completa y lista para usar! 🎉

