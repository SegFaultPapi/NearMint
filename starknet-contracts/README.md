# NearMint NFT - Contrato de Starknet

## 📝 Descripción

Contrato inteligente ERC-721 (NFT) implementado en Cairo para Starknet. Este contrato permite la creación y gestión de tokens NFT con metadata personalizable.

## 🎯 Características

- ✅ **Estándar ERC-721**: Implementación completa usando OpenZeppelin
- ✅ **Minteo Individual**: Crear NFTs uno a uno con URI personalizada
- ✅ **Minteo por Lotes**: Crear múltiples NFTs en una sola transacción
- ✅ **Control de Acceso**: Solo el propietario puede mintear
- ✅ **Gestión de Ownership**: Transferir la propiedad del contrato
- ✅ **URI Base Configurable**: Actualizar la URI base para metadata

## 🏗️ Estructura del Contrato

### Almacenamiento

```cairo
struct Storage {
    erc721: ERC721Component::Storage,      // Componente ERC721 de OpenZeppelin
    src5: SRC5Component::Storage,          // Componente SRC5 para introspección
    owner: ContractAddress,                 // Propietario del contrato
    token_uri_base: ByteArray,             // URI base para metadata
    next_token_id: u256,                   // Siguiente ID de token disponible
}
```

### Funciones Principales

#### `mint(to: ContractAddress, token_uri: ByteArray) -> u256`
Mintea un nuevo NFT con URI personalizada.
- **Parámetros:**
  - `to`: Dirección que recibirá el NFT
  - `token_uri`: URI de la metadata del NFT
- **Retorna:** ID del token minteado
- **Restricción:** Solo el propietario

#### `mint_batch(to: ContractAddress, quantity: u256) -> Span<u256>`
Mintea múltiples NFTs en una transacción.
- **Parámetros:**
  - `to`: Dirección que recibirá los NFTs
  - `quantity`: Cantidad de NFTs a mintear
- **Retorna:** Array con los IDs de tokens minteados
- **Restricción:** Solo el propietario

#### `get_next_token_id() -> u256`
Obtiene el siguiente ID de token disponible.

#### `get_owner() -> ContractAddress`
Obtiene la dirección del propietario del contrato.

#### `transfer_ownership(new_owner: ContractAddress)`
Transfiere la propiedad del contrato a una nueva dirección.
- **Restricción:** Solo el propietario actual

#### `get_base_uri() -> ByteArray`
Obtiene la URI base configurada.

#### `set_base_uri(new_base_uri: ByteArray)`
Actualiza la URI base para metadata.
- **Restricción:** Solo el propietario

### Funciones ERC-721 Heredadas

El contrato también incluye todas las funciones estándar de ERC-721:
- `balance_of(account: ContractAddress) -> u256`
- `owner_of(token_id: u256) -> ContractAddress`
- `transfer_from(from: ContractAddress, to: ContractAddress, token_id: u256)`
- `approve(to: ContractAddress, token_id: u256)`
- `set_approval_for_all(operator: ContractAddress, approved: bool)`
- `get_approved(token_id: u256) -> ContractAddress`
- `is_approved_for_all(owner: ContractAddress, operator: ContractAddress) -> bool`

## 🔧 Compilación

Para compilar el contrato:

```bash
cd starknet-contracts
scarb build
```

Los artefactos compilados se generarán en `target/dev/`:
- `nearmint_nft_NearMintNFT.contract_class.json` (Sierra)
- `nearmint_nft_NearMintNFT.compiled_contract_class.json` (CASM)

## 🧪 Testing

### Tests Unitarios

Los tests están definidos en `src/tests.cairo`. Para ejecutarlos necesitas instalar las herramientas de testing:

1. **Instalar Rust y Cargo** (requerido para snforge):
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. **Ejecutar tests**:
```bash
snforge test
```

### Tests Incluidos

- ✅ `test_mint`: Verifica el minteo individual
- ✅ `test_mint_multiple`: Verifica múltiples minteos
- ✅ `test_mint_batch`: Verifica el minteo por lotes
- ✅ `test_mint_only_owner`: Verifica que solo el owner puede mintear
- ✅ `test_transfer_ownership`: Verifica la transferencia de propiedad
- ✅ `test_transfer_ownership_only_owner`: Verifica restricción de ownership
- ✅ `test_set_base_uri`: Verifica actualización de URI base
- ✅ `test_erc721_transfer`: Verifica transferencias de NFTs

## 🚀 Despliegue

### Usando Starkli

1. **Declarar el contrato:**
```bash
starkli declare target/dev/nearmint_nft_NearMintNFT.contract_class.json
```

2. **Desplegar el contrato:**
```bash
starkli deploy <CLASS_HASH> \
  <OWNER_ADDRESS> \
  str:"NearMint NFT" \
  str:"NMNFT" \
  str:"https://nearmint.io/metadata/"
```

### Usando Foundry (sncast)

```bash
sncast declare --contract-name NearMintNFT
sncast deploy --class-hash <CLASS_HASH> \
  --constructor-calldata <OWNER_ADDRESS> \
                         "NearMint NFT" \
                         "NMNFT" \
                         "https://nearmint.io/metadata/"
```

## 📦 Dependencias

- **Cairo**: 2.11.4
- **Starknet**: 2.11.4
- **OpenZeppelin Contracts**: v0.20.0

## 🔐 Seguridad

- ✅ Solo el propietario puede mintear NFTs
- ✅ Solo el propietario puede transferir ownership
- ✅ Solo el propietario puede actualizar la URI base
- ✅ IDs de tokens se incrementan automáticamente (previene colisiones)
- ✅ Usa componentes auditados de OpenZeppelin

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Contacto

Para preguntas o soporte, contacta al equipo de NearMint.

---

**Estado del Proyecto**: ✅ Compilado y Listo para Despliegue

