#!/bin/bash
set -e

echo "🚀 Iniciando deployment de NearMint NFT Simplificado en Starknet Sepolia..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paso 1: Desplegar cuenta
echo -e "${BLUE}Paso 1: Desplegando cuenta...${NC}"
sncast --profile nearmint account deploy --name nearmint_deployer --fee-token strk --max-fee 0.01
echo ""

# Paso 2: Declarar el contrato
echo -e "${BLUE}Paso 2: Declarando contrato NFT...${NC}"
DECLARE_OUTPUT=$(sncast --profile nearmint declare --contract-name NearMintNFT --fee-token strk --max-fee 0.1 2>&1)
echo "$DECLARE_OUTPUT"

# Extraer class hash
CLASS_HASH=$(echo "$DECLARE_OUTPUT" | grep -oP 'class_hash: \K0x[0-9a-fA-F]+' || echo "$DECLARE_OUTPUT" | grep -oP 'Class hash: \K0x[0-9a-fA-F]+')

if [ -z "$CLASS_HASH" ]; then
    echo -e "${YELLOW}⚠️  No se pudo extraer class hash automáticamente${NC}"
    echo "Copialo manualmente del output anterior"
    read -p "Ingresa el Class Hash: " CLASS_HASH
fi

echo -e "${GREEN}✅ Class Hash: $CLASS_HASH${NC}"
echo ""

# Paso 3: Desplegar el contrato
echo -e "${BLUE}Paso 3: Desplegando contrato NFT...${NC}"

# Constructor args: name, symbol, base_uri (versión simplificada)
DEPLOY_OUTPUT=$(sncast --profile nearmint deploy \
  --class-hash "$CLASS_HASH" \
  --constructor-calldata str:"NearMint NFT" str:"NMNFT" str:"https://nearmint.io/metadata/" \
  --fee-token strk \
  --max-fee 0.1 2>&1)

echo "$DEPLOY_OUTPUT"

# Extraer contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'contract_address: \K0x[0-9a-fA-F]+' || echo "$DEPLOY_OUTPUT" | grep -oP 'Contract address: \K0x[0-9a-fA-F]+')

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ¡Deployment completado exitosamente!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📋 Detalles del contrato:${NC}"
echo ""
echo -e "  ${YELLOW}Class Hash:${NC}     $CLASS_HASH"
echo -e "  ${YELLOW}Contract Address:${NC} $CONTRACT_ADDRESS"
echo -e "  ${YELLOW}Network:${NC}        Sepolia Testnet"
echo ""
echo -e "${BLUE}🔍 Ver en Starkscan:${NC}"
echo "  https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS"
echo ""
echo -e "${BLUE}📝 Guarda esta información:${NC}"
cat > deployment_info_simple.txt << DEPLOY_EOF
NearMint NFT Simplificado - Deployment Info
===========================================
Network: Starknet Sepolia Testnet
Date: $(date)

Class Hash: $CLASS_HASH
Contract Address: $CONTRACT_ADDRESS

Starkscan: https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS

Funciones disponibles:
- mint() - Mintea un NFT directamente al usuario que llama la función
- get_next_token_id() - Obtiene el ID del próximo token
- get_total_minted() - Obtiene el total de NFTs minteados

Funciones ERC721 heredadas:
- owner_of(token_id)
- balance_of(address)
- transfer_from(from, to, token_id)
- approve(to, token_id)
- get_base_uri()
- set_base_uri(new_base_uri)
DEPLOY_EOF

echo "  Información guardada en: deployment_info_simple.txt"
echo ""
echo -e "${BLUE}🎯 Para probar el contrato:${NC}"
echo "  sncast --profile nearmint call --contract-address $CONTRACT_ADDRESS --function mint"
echo ""

