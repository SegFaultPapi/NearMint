# 🔄 Actualización ChipiSDK

## Problema Encontrado

❌ **Error:**
```
TypeError: useGetTokenBalance is not a function
```

**Causa:** La versión `11.2.0` de `@chipi-stack/nextjs` no incluía el hook `useGetTokenBalance`.

---

## Solución Aplicada

✅ **Actualización de ChipiSDK**

```bash
npm update @chipi-stack/nextjs
```

**Versión anterior:** `11.2.0`  
**Versión nueva:** `11.5.0`

---

## Hooks Disponibles Ahora

### Antes (v11.2.0):
```typescript
- useApprove
- useCallAnyContract
- useChipiContext
- useCreateWallet
- useGetWallet
- useRecordSendTransaction
- useStakeVesuUsdc
- useTransfer
- useWithdrawVesuUsdc
```

### Después (v11.5.0):
```typescript
- useApprove
- useCallAnyContract
- useChipiContext
- useCreateWallet
+ useGetTokenBalance ✨ NUEVO
- useGetWallet
- useRecordSendTransaction
- useStakeVesuUsdc
- useTransfer
- useWithdrawVesuUsdc
```

---

## Cambios en Dependencias

```diff
Package                     Antes    Después
@chipi-stack/nextjs        11.2.0 → 11.5.0
```

**Total de paquetes actualizados:** 6

---

## Funcionalidad Restaurada

✅ **Balance USDC Real**
- Componente: `components/usdc-balance.tsx`
- Hook: `useGetTokenBalance`
- Página: `/dashboard/wallet`

**Estado:** Funcionando correctamente

---

## Verificación

Para verificar la instalación correcta:

```bash
# Verificar versión
npm list @chipi-stack/nextjs

# Verificar hook disponible
cat node_modules/@chipi-stack/nextjs/dist/cjs/hooks.d.ts | grep useGetTokenBalance
```

**Resultado esperado:**
```
my-v0-project@0.1.0 /home/andru/NearMint-App/near-mint
└── @chipi-stack/nextjs@11.5.0
```

---

## Próximos Pasos

Con ChipiSDK actualizado, ahora puedes:

1. ✅ **Mostrar balance USDC real** - Implementado
2. 🔜 **Enviar USDC** - Usar `send-usdc-dialog` del MCP
3. 🔜 **Historial de transacciones** - Explorar nuevos hooks
4. 🔜 **Staking de USDC** - Usar `useStakeVesuUsdc`

---

## Notas Importantes

- ⚠️ Siempre reiniciar el servidor después de actualizar dependencias
- ⚠️ ChipiSDK se actualiza frecuentemente, revisar changelog
- ✅ La versión 11.5.0 es compatible con tu configuración actual
- ✅ No hay breaking changes que afecten el código existente

---

## Compatibilidad

**Versión de Node.js:** Compatible  
**Versión de Next.js:** 15.5.4 ✅  
**Versión de React:** Compatible  
**Versión de Clerk:** Compatible  

---

## Comando para Actualizar (Futuro)

Si necesitas actualizar manualmente en el futuro:

```bash
# Actualizar a última versión
npm update @chipi-stack/nextjs

# O instalar versión específica
npm install @chipi-stack/nextjs@latest

# Limpiar caché (si hay problemas)
rm -rf node_modules/.cache
npm run dev
```

---

## Estado Final

✅ **ChipiSDK actualizado correctamente**  
✅ **Hook `useGetTokenBalance` disponible**  
✅ **Balance USDC funcionando**  
✅ **Servidor reiniciado**  
✅ **Sin breaking changes**

**Fecha de actualización:** $(date)
**Tiempo de resolución:** ~5 minutos

