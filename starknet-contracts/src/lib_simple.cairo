mod tests;

#[starknet::contract]
mod NearMintNFT {
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::introspection::src5::SRC5Component;
    use starknet::{ContractAddress, get_caller_address};

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        next_token_id: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        NFTMinted: NFTMinted,
    }

    #[derive(Drop, starknet::Event)]
    struct NFTMinted {
        token_id: u256,
        to: ContractAddress,
        minter: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, name: ByteArray, symbol: ByteArray, base_uri: ByteArray) {
        self.erc721.initializer(name, symbol, base_uri);
        self.next_token_id.write(1);
    }

    #[abi(embed_v0)]
    impl NearMintNFTImpl of super::INearMintNFT<ContractState> {
        // Función principal: cualquier usuario puede mintear un NFT para sí mismo
        fn mint(ref self: ContractState) -> u256 {
            let caller = get_caller_address();
            let token_id = self.next_token_id.read();
            
            // El usuario que llama a mint recibe el NFT directamente
            self.erc721.mint(caller, token_id);
            self.next_token_id.write(token_id + 1);
            
            self.emit(NFTMinted { 
                token_id, 
                to: caller, 
                minter: caller 
            });
            
            token_id
        }

        // Función para obtener el siguiente token ID
        fn get_next_token_id(self: @ContractState) -> u256 {
            self.next_token_id.read()
        }

        // Función para obtener el total de NFTs minteados
        fn get_total_minted(self: @ContractState) -> u256 {
            self.next_token_id.read() - 1
        }
    }
}

#[starknet::interface]
trait INearMintNFT<TContractState> {
    fn mint(ref self: TContractState) -> u256;
    fn get_next_token_id(self: @TContractState) -> u256;
    fn get_total_minted(self: @TContractState) -> u256;
}

