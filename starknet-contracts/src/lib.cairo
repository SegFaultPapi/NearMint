mod tests;

#[starknet::contract]
mod NearMintNFT {
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::introspection::src5::SRC5Component;
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin - Simplificado
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    // Hooks simplificados
    impl ERC721HooksImpl of ERC721Component::ERC721HooksTrait<ContractState> {
        fn before_update(ref self: ERC721Component::ComponentState<ContractState>, to: ContractAddress, token_id: u256, auth: ContractAddress) {}
        fn after_update(ref self: ERC721Component::ComponentState<ContractState>, to: ContractAddress, token_id: u256, auth: ContractAddress) {}
    }

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        owner: ContractAddress,
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
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, name: ByteArray, symbol: ByteArray, base_uri: ByteArray) {
        self.erc721.initializer(name, symbol, base_uri);
        self.owner.write(owner);
        self.next_token_id.write(1);
    }

    #[abi(embed_v0)]
    impl NearMintNFTImpl of super::INearMintNFT<ContractState> {
        // Mint NFT simplificado
        fn mint(ref self: ContractState, to: ContractAddress) -> u256 {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can mint');

            let token_id = self.next_token_id.read();
            self.erc721.mint(to, token_id);
            self.next_token_id.write(token_id + 1);
            self.emit(NFTMinted { token_id, to });
            token_id
        }

        // Mint batch simplificado
        fn mint_batch(ref self: ContractState, to: ContractAddress, quantity: u256) -> Span<u256> {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can mint');

            let mut token_ids: Array<u256> = ArrayTrait::new();
            let mut i: u256 = 0;

            loop {
                if i >= quantity { break; }
                let token_id = self.next_token_id.read();
                self.erc721.mint(to, token_id);
                self.next_token_id.write(token_id + 1);
                token_ids.append(token_id);
                i += 1;
            };
            token_ids.span()
        }

        fn get_next_token_id(self: @ContractState) -> u256 {
            self.next_token_id.read()
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        fn transfer_ownership(ref self: ContractState, new_owner: ContractAddress) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can transfer');
            self.owner.write(new_owner);
        }
    }
}

#[starknet::interface]
trait INearMintNFT<TContractState> {
    fn mint(ref self: TContractState, to: starknet::ContractAddress) -> u256;
    fn mint_batch(ref self: TContractState, to: starknet::ContractAddress, quantity: u256) -> Span<u256>;
    fn get_next_token_id(self: @TContractState) -> u256;
    fn get_owner(self: @TContractState) -> starknet::ContractAddress;
    fn transfer_ownership(ref self: TContractState, new_owner: starknet::ContractAddress);
}

