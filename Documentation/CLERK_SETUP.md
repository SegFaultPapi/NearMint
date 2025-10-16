# 🔐 Configuración de Clerk para NearMint

## Paso 1: Obtener las claves de Clerk

1. Ve a [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Crea una cuenta o inicia sesión
3. Crea una nueva aplicación (Application)
4. Ve a **API Keys** en el menú lateral

## Paso 2: Configurar las variables de entorno

Copia las siguientes claves y agrégalas a tu archivo `.env`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXX

# URLs de redirección (ya configuradas)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Paso 3: Configurar URLs en el Dashboard de Clerk

En el dashboard de Clerk, ve a **Paths** y configura:

- **Sign in URL**: `/sign-in`
- **Sign up URL**: `/sign-up`
- **After sign in URL**: `/dashboard`
- **After sign up URL**: `/dashboard`

## Paso 4: Probar la integración

```bash
npm run dev
```

Luego visita:
- Página principal: `http://localhost:3000`
- Haz clic en "Start Now" - te redirigirá a `/sign-in`
- Crea una cuenta o inicia sesión
- Serás redirigido al dashboard

## ✅ Funcionalidades Implementadas

- ✅ Protección de todas las rutas `/dashboard/*` con middleware
- ✅ Botón "Start Now" redirige a sign-in si no está autenticado
- ✅ Páginas personalizadas de sign-in y sign-up con el branding de NearMint
- ✅ Sidebar actualizado con información del usuario de Clerk
- ✅ Botón de cerrar sesión integrado con Clerk y Wallet
- ✅ Integración de Clerk con ChipiProvider en el layout principal

## 🎨 Personalización Adicional (Opcional)

Puedes personalizar más los componentes de Clerk en el dashboard:
1. Ve a **Customization** → **Theme**
2. Personaliza colores, logos y textos
3. Los cambios se aplicarán automáticamente

## 🔒 Flujo de Autenticación

1. Usuario hace clic en "Start Now"
2. Si NO está autenticado → Redirige a `/sign-in`
3. Usuario se registra o inicia sesión
4. Clerk autentica y redirige a `/dashboard`
5. Middleware protege todas las rutas del dashboard
6. Usuario puede conectar su wallet en el dashboard
7. "Cerrar Sesión" desconecta wallet y cierra sesión de Clerk

