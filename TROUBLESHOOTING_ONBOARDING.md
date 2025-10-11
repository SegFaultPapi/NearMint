# 🔧 Troubleshooting: Onboarding y Creación de PIN

## ❌ Problema: La página de PIN aparece y redirige inmediatamente al dashboard

### 🔍 Causas Posibles:

1. **localStorage con datos residuales** de un usuario anterior
2. **El contexto de Wallet detecta wallet existente** incorrectamente
3. **Redirect demasiado rápido** antes de que cargue la UI

### ✅ Soluciones Implementadas:

#### 1. Delay en el Redirect
La página ahora espera 500ms antes de verificar si el usuario tiene wallet. Esto evita redirects prematuros.

```typescript
// En app/onboarding/create-pin/page.tsx
const [shouldCheckWallet, setShouldCheckWallet] = useState(false)

useEffect(() => {
  const timer = setTimeout(() => {
    setShouldCheckWallet(true)
  }, 500)
  return () => clearTimeout(timer)
}, [])
```

#### 2. Verificación de Usuario en localStorage
Ahora el localStorage incluye el `userId` para verificar que los datos pertenecen al usuario actual.

```typescript
// En contexts/wallet-context.tsx
const storedUserId = localStorage.getItem("chipi_wallet_user_id")

// Si hay datos pero son de otro usuario, limpiarlos
if (storedUserId && storedUserId !== user?.id) {
  localStorage.removeItem("chipi_wallet_address")
  localStorage.removeItem("chipi_wallet_connected")
  localStorage.removeItem("chipi_wallet_user_id")
  setHasWallet(false)
}
```

#### 3. Limpieza Automática
El contexto ahora limpia automáticamente datos de usuarios anteriores.

---

## 🧪 Cómo Probar:

### Escenario 1: Usuario NUEVO (Happy Path)
1. Abre modo incógnito en el navegador
2. Ve a tu sitio
3. Click en "Sign Up"
4. Completa el registro con Clerk
5. ✅ **Deberías ver la página de crear PIN** (sin redirect)
6. Ingresa PIN: `1234` (dos veces)
7. Click "Confirmar y Continuar"
8. ✅ Ver "Configurando tu Cuenta"
9. ✅ Ver "¡Todo Listo!"
10. ✅ Redirect automático al dashboard

### Escenario 2: Usuario con localStorage residual
1. Si has probado antes, puede haber datos en localStorage
2. **Opción A:** Limpiar manualmente
   - DevTools → Application → Local Storage → Clear All
3. **Opción B:** Usar el script
   - Abre DevTools → Console
   - Copia y pega el contenido de `clear-local-storage.js`
   - Presiona Enter
4. Recarga la página
5. Prueba el Escenario 1

### Escenario 3: Usuario con wallet existente
1. Usuario ya tiene wallet creada
2. Intenta ir a `/onboarding/create-pin`
3. ✅ Debería redirigir automáticamente al dashboard

---

## 🐛 Si Aún Tienes Problemas:

### Problema: Sigue redirigiendo inmediatamente

**Debug Step 1: Verificar localStorage**
```javascript
// En la consola del navegador:
console.log({
  address: localStorage.getItem('chipi_wallet_address'),
  connected: localStorage.getItem('chipi_wallet_connected'),
  userId: localStorage.getItem('chipi_wallet_user_id')
})
```

**Si hay valores:**
```javascript
// Limpiar manualmente:
localStorage.removeItem('chipi_wallet_address')
localStorage.removeItem('chipi_wallet_connected')
localStorage.removeItem('chipi_wallet_user_id')
location.reload()
```

**Debug Step 2: Verificar el estado del contexto**
```typescript
// Agregar console.log temporal en wallet-context.tsx
console.log('WalletContext state:', {
  hasWallet,
  address,
  isConnected,
  userId: user?.id
})
```

**Debug Step 3: Verificar el estado de la página**
```typescript
// Agregar console.log temporal en create-pin/page.tsx
console.log('CreatePin state:', {
  hasWallet,
  shouldCheckWallet,
  step,
  isLoaded
})
```

---

## 🔄 Flujo Correcto:

```
Usuario hace Sign Up
    ↓
Clerk crea cuenta
    ↓
Redirect a /onboarding/create-pin
    ↓
Página carga (500ms)
    ↓
checkWalletStatus() ejecuta
    ↓
¿Tiene datos en localStorage?
    ├── SÍ → ¿Es del mismo usuario?
    │        ├── SÍ → hasWallet = true → Redirect a dashboard
    │        └── NO → Limpiar datos → hasWallet = false → Mostrar form
    └── NO → hasWallet = false → Mostrar form
    ↓
Usuario ingresa PIN
    ↓
ChipiSDK crea wallet
    ↓
Guarda en localStorage + userId
    ↓
Redirect a dashboard
```

---

## 📝 Logs Útiles para Debug:

### En wallet-context.tsx:
```typescript
const checkWalletStatus = async () => {
  console.log('🔍 Checking wallet status for user:', user?.id)
  
  const storedUserId = localStorage.getItem("chipi_wallet_user_id")
  const storedAddress = localStorage.getItem("chipi_wallet_address")
  
  console.log('📦 localStorage:', { storedUserId, storedAddress })
  
  if (storedUserId && storedUserId !== user?.id) {
    console.log('🧹 Limpiando datos de usuario anterior')
    // ... limpiar
  }
  
  console.log('✅ hasWallet:', hasWallet)
}
```

### En create-pin/page.tsx:
```typescript
useEffect(() => {
  console.log('🎯 CreatePin mounted:', {
    hasWallet,
    shouldCheckWallet,
    step,
    userId: user?.id
  })
}, [hasWallet, shouldCheckWallet, step, user?.id])
```

---

## 💡 Tips para Desarrollo:

1. **Usa modo incógnito** para probar sign-up fresh
2. **Limpia localStorage** entre pruebas de diferentes usuarios
3. **Verifica DevTools → Application → Local Storage** para ver qué hay guardado
4. **Usa diferentes emails** para cada prueba (test1@example.com, test2@example.com)
5. **Verifica la consola** para ver logs de debug

---

## 🎯 Valores Esperados en localStorage:

### Usuario SIN wallet (nuevo):
```
chipi_wallet_address: null
chipi_wallet_connected: null
chipi_wallet_user_id: null
```

### Usuario CON wallet:
```
chipi_wallet_address: "0x123abc..."
chipi_wallet_connected: "true"
chipi_wallet_user_id: "user_abc123"
```

---

## ✅ Checklist de Verificación:

- [ ] localStorage limpio antes de la prueba
- [ ] Modo incógnito o sesión fresh
- [ ] Clerk configurado correctamente
- [ ] ChipiSDK API keys válidas
- [ ] Network tab muestra llamadas exitosas
- [ ] No hay errores en console
- [ ] La página de PIN se muestra al menos 500ms
- [ ] El redirect solo ocurre después de crear wallet

---

Si después de todo esto aún tienes problemas, revisa:
1. Configuración de Clerk (afterSignUpUrl)
2. Variables de entorno (.env)
3. Que ChipiProvider esté en el layout
4. Permisos de red (firewall, CORS)

¿Necesitas más ayuda? Abre DevTools y comparte los logs de console. 🚀

