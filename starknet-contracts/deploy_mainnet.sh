#!/bin/bash

# Deploy NearMint NFT to Starknet Mainnet
# Este script despliega el contrato con los parámetros correctos

CLASS_HASH="0x079e3b828ae7e20ab6e7c545efbd38b22a8dc9af7c320d0f415d995d69bc9f9d"
OWNER_ADDRESS="0x02c611a3ce30a9bd8eadff745bbed39ad01a8434cfa30cf4c27a5a07c29b5bfb"

echo "🚀 Desplegando NearMint NFT en Starknet Mainnet..."
echo "📋 Class Hash: $CLASS_HASH"
echo "👤 Owner: $OWNER_ADDRESS"
echo ""

# Deploy usando starkli o sncast
# Nota: ByteArray en Cairo requiere formato especial
# Formato ByteArray: [pending_word_len, pending_word, num_full_words, ...full_words]

sncast --account my_mainnet \
  deploy \
  --network mainnet \
  --class-hash "$CLASS_HASH" \
  --constructor-calldata \
    "$OWNER_ADDRESS" \
    0 1 4722576078895984486 0 \
    0 1 5131854 0 \
    0 3 31525386417492167043934821126291823677 452318453327680847729772 0

echo ""
echo "✅ Despliegue completado"

