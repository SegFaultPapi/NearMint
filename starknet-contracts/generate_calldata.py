#!/usr/bin/env python3
"""
Genera el calldata correcto para el constructor de NearMintNFT
ByteArray format en Cairo: [num_full_words, ...full_words, pending_word, pending_word_len]
"""

def string_to_bytearray_calldata(s):
    """Convierte un string a formato ByteArray de Cairo"""
    encoded = s.encode('utf-8')
    full_words = []
    
    # Dividir en palabras de 31 bytes (248 bits)
    i = 0
    while i + 31 <= len(encoded):
        word = int.from_bytes(encoded[i:i+31], 'big')
        full_words.append(hex(word))
        i += 31
    
    # Palabra pendiente
    pending_word = 0
    pending_len = 0
    if i < len(encoded):
        pending_word = int.from_bytes(encoded[i:], 'big')
        pending_len = len(encoded) - i
    
    # Retornar en formato: [num_full_words, ...full_words, pending_word, pending_word_len]
    result = [str(len(full_words))]
    result.extend(full_words)
    result.append(hex(pending_word))
    result.append(str(pending_len))
    
    return result

# Parámetros
owner = "0x02c611a3ce30a9bd8eadff745bbed39ad01a8434cfa30cf4c27a5a07c29b5bfb"
name = "NearMintNFT"
symbol = "NMNFT"
base_uri = "https://nearmint.io/metadata/"

print("=== Calldata para constructor ===\n")
print(f"Owner: {owner}")

name_calldata = string_to_bytearray_calldata(name)
symbol_calldata = string_to_bytearray_calldata(symbol)
base_uri_calldata = string_to_bytearray_calldata(base_uri)

print(f"\nName ByteArray: {' '.join(name_calldata)}")
print(f"Symbol ByteArray: {' '.join(symbol_calldata)}")
print(f"Base URI ByteArray: {' '.join(base_uri_calldata)}")

# Comando completo
calldata = [owner] + name_calldata + symbol_calldata + base_uri_calldata
print(f"\n=== Comando completo ===\n")
print(f"sncast --account my_mainnet deploy \\")
print(f"  --network mainnet \\")
print(f"  --class-hash 0x079e3b828ae7e20ab6e7c545efbd38b22a8dc9af7c320d0f415d995d69bc9f9d \\")
print(f"  --constructor-calldata {' '.join(calldata)}")

