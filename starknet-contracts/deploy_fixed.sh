#!/bin/bash

# Script para desplegar el contrato NearMint NFT corregido
# Este contrato permite que cualquier usuario mintee NFTs

echo "🚀 Desplegando NearMint NFT Contract (Versión Corregida)"
echo "=================================================="

# Compilar el contrato
echo "📦 Compilando contrato..."
snforge build

if [ $? -ne 0 ]; then
    echo "❌ Error compilando el contrato"
    exit 1
fi

echo "✅ Contrato compilado exitosamente"

# Obtener el class hash
CLASS_HASH=$(sncast --json declare --class-name NearMintNFT --max-fee 1000000000000000000000 | jq -r '.class_hash')

if [ "$CLASS_HASH" = "null" ] || [ -z "$CLASS_HASH" ]; then
    echo "❌ Error obteniendo class hash"
    exit 1
fi

echo "📋 Class Hash: $CLASS_HASH"

# Parámetros del constructor
OWNER="0x02c611a3ce30a9bd8eadff745bbed39ad01a8434cfa30cf4c27a5a07c29b5bfb"  # Owner original
NAME="NearMintNFT"
SYMBOL="NMNFT"
BASE_URI="https://nearmint.io/metadata/"

echo "🏗️ Desplegando contrato..."
echo "Owner: $OWNER"
echo "Name: $NAME"
echo "Symbol: $SYMBOL"
echo "Base URI: $BASE_URI"

# Desplegar el contrato
DEPLOY_RESULT=$(sncast --json deploy \
    --class-hash $CLASS_HASH \
    --constructor-calldata $OWNER \
    --max-fee 1000000000000000000000)

if [ $? -ne 0 ]; then
    echo "❌ Error desplegando el contrato"
    exit 1
fi

# Extraer información del despliegue
CONTRACT_ADDRESS=$(echo $DEPLOY_RESULT | jq -r '.contract_address')
TRANSACTION_HASH=$(echo $DEPLOY_RESULT | jq -r '.transaction_hash')

echo "✅ Contrato desplegado exitosamente!"
echo "=================================================="
echo "📍 Contract Address: $CONTRACT_ADDRESS"
echo "🔗 Transaction Hash: $TRANSACTION_HASH"
echo "📋 Class Hash: $CLASS_HASH"
echo "=================================================="

# Crear archivo de información del despliegue
cat > deployment_fixed.md << EOF
# 🚀 NearMint NFT - Contrato Corregido Desplegado

## ✅ Despliegue Exitoso

**Fecha**: $(date)  
**Red**: Starknet Mainnet  
**Estado**: ✅ Desplegado Exitosamente

---

## 📋 Información del Contrato

### Contrato Principal
- **Contract Address**: \`$CONTRACT_ADDRESS\`
- **Transaction Hash**: \`$TRANSACTION_HASH\`
- **Class Hash**: \`$CLASS_HASH\`

### Configuración
- **Nombre**: $NAME
- **Símbolo**: $SYMBOL
- **Owner**: \`$OWNER\`
- **Base URI**: \`$BASE_URI\`

---

## 🔗 Enlaces Útiles

### Exploradores de Blockchain
- **Starkscan**: https://starkscan.co/contract/$CONTRACT_ADDRESS
- **Transacción**: https://starkscan.co/tx/$TRANSACTION_HASH

---

## 🎯 Cambios Implementados

### ✅ **Problemas Corregidos:**
1. **Mint Público**: Cualquier usuario puede mintear NFTs (sin restricción de owner)
2. **Metadata URI**: Se genera automáticamente la URI de metadata
3. **Eventos Mejorados**: Se incluye información del minter en los eventos

### ✅ **Funcionalidades:**
- ✅ **mint(to)**: Crear NFT individual (cualquier usuario)
- ✅ **mint_batch(to, quantity)**: Crear múltiples NFTs (cualquier usuario)
- ✅ **get_next_token_id()**: Obtener siguiente ID disponible
- ✅ **get_owner()**: Obtener propietario del contrato
- ✅ **transfer_ownership(new_owner)**: Transferir ownership

---

## 🧪 Testing

Para probar el contrato:

\`\`\`bash
# Mint un NFT
sncast --account my_mainnet call \\
  --contract-address $CONTRACT_ADDRESS \\
  --function mint \\
  --calldata 0x[RECIPIENT_ADDRESS] \\
  --network mainnet

# Mint batch (5 NFTs)
sncast --account my_mainnet call \\
  --contract-address $CONTRACT_ADDRESS \\
  --function mint_batch \\
  --calldata 0x[RECIPIENT_ADDRESS] 5 \\
  --network mainnet
\`\`\`

---

*Contrato corregido desplegado exitosamente en Starknet Mainnet* 🚀
EOF

echo "📄 Información del despliegue guardada en: deployment_fixed.md"
echo "🎉 ¡Despliegue completado!"


