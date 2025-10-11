# 📚 Ejemplos de Uso - NearMint NFT

## Interacción con el Contrato

### 1. Mintear un NFT Individual

```javascript
// Usando starknet.js
import { Contract, Account, Provider } from "starknet";

const provider = new Provider({ sequencer: { network: "goerli-alpha" } });
const account = new Account(provider, accountAddress, privateKey);

const nftContract = new Contract(abi, contractAddress, account);

// Mintear NFT
const recipient = "0x1234..."; // Dirección del destinatario
const tokenUri = "ipfs://QmHash123.../metadata.json";

const result = await nftContract.mint(recipient, tokenUri);
await provider.waitForTransaction(result.transaction_hash);

console.log("Token ID minteado:", result.result);
```

### 2. Mintear Múltiples NFTs (Batch)

```javascript
// Mintear 5 NFTs a la vez
const recipient = "0x1234...";
const quantity = 5;

const result = await nftContract.mint_batch(recipient, quantity);
await provider.waitForTransaction(result.transaction_hash);

console.log("Token IDs minteados:", result.result);
```

### 3. Consultar Información del NFT

```javascript
// Obtener el propietario de un token
const tokenId = 1;
const owner = await nftContract.owner_of(tokenId);
console.log("Propietario del token:", owner);

// Obtener el balance de una dirección
const address = "0x1234...";
const balance = await nftContract.balance_of(address);
console.log("Balance de NFTs:", balance);

// Obtener el siguiente ID de token disponible
const nextId = await nftContract.get_next_token_id();
console.log("Próximo token ID:", nextId);
```

### 4. Transferir un NFT

```javascript
// Transferir NFT de una dirección a otra
const from = "0x1234...";
const to = "0x5678...";
const tokenId = 1;

const result = await nftContract.transfer_from(from, to, tokenId);
await provider.waitForTransaction(result.transaction_hash);

console.log("NFT transferido exitosamente");
```

### 5. Aprobar Transferencias

```javascript
// Aprobar a un operador para un token específico
const operator = "0x5678...";
const tokenId = 1;

await nftContract.approve(operator, tokenId);

// Aprobar a un operador para todos los tokens
const operator = "0x5678...";
await nftContract.set_approval_for_all(operator, true);

// Verificar aprobación
const approved = await nftContract.get_approved(tokenId);
console.log("Operador aprobado:", approved);
```

### 6. Gestionar el Contrato (Solo Owner)

```javascript
// Transferir propiedad del contrato
const newOwner = "0x9abc...";
await nftContract.transfer_ownership(newOwner);

// Actualizar URI base
const newBaseUri = "https://api.nearmint.io/nft/";
await nftContract.set_base_uri(newBaseUri);

// Obtener URI base actual
const baseUri = await nftContract.get_base_uri();
console.log("URI Base:", baseUri);
```

## Usando la CLI (starkli)

### Mintear NFT

```bash
# Mintear un NFT
starkli invoke \
  --account ~/.starkli-wallets/account.json \
  --keystore ~/.starkli-wallets/keystore.json \
  <CONTRACT_ADDRESS> \
  mint \
  <RECIPIENT_ADDRESS> \
  str:"ipfs://QmHash123/metadata.json"
```

### Consultar Información

```bash
# Obtener owner de un token
starkli call <CONTRACT_ADDRESS> owner_of 1

# Obtener balance
starkli call <CONTRACT_ADDRESS> balance_of <ADDRESS>

# Obtener siguiente token ID
starkli call <CONTRACT_ADDRESS> get_next_token_id
```

### Batch Minting

```bash
starkli invoke \
  --account ~/.starkli-wallets/account.json \
  --keystore ~/.starkli-wallets/keystore.json \
  <CONTRACT_ADDRESS> \
  mint_batch \
  <RECIPIENT_ADDRESS> \
  5
```

## Estructura de Metadata (JSON)

La metadata de cada NFT debe seguir el estándar ERC-721:

```json
{
  "name": "NearMint NFT #1",
  "description": "Un NFT único de la colección NearMint",
  "image": "ipfs://QmImageHash123/image.png",
  "external_url": "https://nearmint.io/nft/1",
  "attributes": [
    {
      "trait_type": "Rareza",
      "value": "Legendario"
    },
    {
      "trait_type": "Color",
      "value": "Dorado"
    },
    {
      "trait_type": "Poder",
      "value": 100,
      "max_value": 100
    }
  ],
  "background_color": "FFD700",
  "animation_url": "ipfs://QmAnimationHash/animation.mp4"
}
```

## Flujo de Trabajo Completo

### 1. Preparar Metadata

```bash
# 1. Subir imagen a IPFS
ipfs add image.png
# Output: QmImageHash123...

# 2. Crear archivo metadata.json
cat > metadata.json << EOF
{
  "name": "Mi NFT",
  "description": "Descripción del NFT",
  "image": "ipfs://QmImageHash123/image.png",
  "attributes": [...]
}
EOF

# 3. Subir metadata a IPFS
ipfs add metadata.json
# Output: QmMetadataHash456...
```

### 2. Mintear NFT

```javascript
const tokenUri = "ipfs://QmMetadataHash456/metadata.json";
const recipient = "0x1234...";

const tx = await nftContract.mint(recipient, tokenUri);
await provider.waitForTransaction(tx.transaction_hash);
```

### 3. Verificar en Block Explorer

Visita [Voyager](https://voyager.online) o [Starkscan](https://starkscan.co) y busca:
- El hash de transacción
- La dirección del contrato
- El token ID

### 4. Mostrar en Frontend

```javascript
// Obtener metadata URI
const tokenId = 1;
const tokenUri = await nftContract.token_uri(tokenId);

// Fetch metadata
const metadata = await fetch(tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/"));
const data = await metadata.json();

// Mostrar en UI
console.log("Nombre:", data.name);
console.log("Imagen:", data.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
```

## Eventos Emitidos

### NFTMinted

```cairo
#[derive(Drop, starknet::Event)]
struct NFTMinted {
    token_id: u256,
    to: ContractAddress,
    token_uri: ByteArray,
}
```

### Escuchar Eventos

```javascript
// Usando starknet.js
const events = await provider.getEvents({
  address: contractAddress,
  from_block: "latest",
  to_block: "latest",
  keys: [["NFTMinted"]]
});

events.forEach(event => {
  console.log("Token ID:", event.data[0]);
  console.log("Recipient:", event.data[1]);
  console.log("Token URI:", event.data[2]);
});
```

## Consideraciones de Gas

| Operación | Gas Estimado (aprox.) |
|-----------|----------------------|
| Mintear 1 NFT | ~50,000 steps |
| Mintear 5 NFTs (batch) | ~200,000 steps |
| Transferir NFT | ~30,000 steps |
| Aprobar operador | ~20,000 steps |
| Set base URI | ~15,000 steps |

**Nota:** Los valores son aproximados y pueden variar según la red y las condiciones.

## Mejores Prácticas

### ✅ Hacer

- Verificar que la dirección del destinatario sea válida antes de mintear
- Almacenar metadata en IPFS para descentralización
- Usar batch minting para múltiples NFTs (ahorra gas)
- Implementar un límite máximo de supply si es necesario
- Verificar eventos para confirmar transacciones

### ❌ Evitar

- No mintear a la dirección cero
- No usar URLs centralizadas para metadata (usar IPFS)
- No mintear cantidades excesivas en un solo batch
- No olvidar manejar errores de transacción
- No exponer claves privadas en el frontend

## Troubleshooting

### Error: "Only owner can mint"
**Solución:** Asegúrate de estar llamando la función desde la cuenta propietaria del contrato.

### Error: "Token does not exist"
**Solución:** Verifica que el token ID exista consultando `get_next_token_id()`.

### Error: "Not token owner"
**Solución:** Solo el propietario del token o un operador aprobado puede transferirlo.

### Transacción Pendiente Mucho Tiempo
**Solución:** 
1. Verifica el estado de la red
2. Incrementa el gas price si es necesario
3. Usa block explorers para verificar el estado

## Recursos Adicionales

- [Documentación de Starknet](https://docs.starknet.io)
- [Cairo Book](https://book.cairo-lang.org)
- [OpenZeppelin Contracts Cairo](https://docs.openzeppelin.com/contracts-cairo)
- [Starknet.js Docs](https://www.starknetjs.com)
- [IPFS Docs](https://docs.ipfs.tech)

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al equipo de soporte.

