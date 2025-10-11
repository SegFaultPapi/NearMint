#[cfg(test)]
mod tests {
    use super::super::{NearMintNFT, INearMintNFTDispatcher, INearMintNFTDispatcherTrait};
    use starknet::{ContractAddress, contract_address_const, get_caller_address};
    use starknet::testing::{set_contract_address, set_caller_address};
    use openzeppelin::token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};

    fn setup() -> (ContractAddress, INearMintNFTDispatcher, IERC721Dispatcher) {
        let owner = contract_address_const::<'OWNER'>();
        let contract_address = contract_address_const::<'CONTRACT'>();
        
        set_contract_address(contract_address);
        set_caller_address(owner);
        
        let name: ByteArray = "NearMint NFT";
        let symbol: ByteArray = "NMNFT";
        let base_uri: ByteArray = "https://nearmint.io/metadata/";
        
        // Deploy contract
        let mut state = NearMintNFT::contract_state_for_testing();
        NearMintNFT::constructor(ref state, owner, name, symbol, base_uri);
        
        let dispatcher = INearMintNFTDispatcher { contract_address };
        let erc721_dispatcher = IERC721Dispatcher { contract_address };
        
        (owner, dispatcher, erc721_dispatcher)
    }

    #[test]
    fn test_mint() {
        let (owner, dispatcher, erc721_dispatcher) = setup();
        let recipient = contract_address_const::<'RECIPIENT'>();
        
        set_caller_address(owner);
        
        let token_uri: ByteArray = "ipfs://QmTest123";
        let token_id = dispatcher.mint(recipient, token_uri);
        
        assert(token_id == 1, 'First token should be ID 1');
        assert(erc721_dispatcher.owner_of(token_id) == recipient, 'Wrong owner');
        assert(dispatcher.get_next_token_id() == 2, 'Next ID should be 2');
    }

    #[test]
    fn test_mint_multiple() {
        let (owner, dispatcher, erc721_dispatcher) = setup();
        let recipient = contract_address_const::<'RECIPIENT'>();
        
        set_caller_address(owner);
        
        let token_uri1: ByteArray = "ipfs://QmTest1";
        let token_uri2: ByteArray = "ipfs://QmTest2";
        
        let token_id1 = dispatcher.mint(recipient, token_uri1);
        let token_id2 = dispatcher.mint(recipient, token_uri2);
        
        assert(token_id1 == 1, 'First token ID wrong');
        assert(token_id2 == 2, 'Second token ID wrong');
        assert(erc721_dispatcher.balance_of(recipient) == 2, 'Balance should be 2');
    }

    #[test]
    fn test_mint_batch() {
        let (owner, dispatcher, erc721_dispatcher) = setup();
        let recipient = contract_address_const::<'RECIPIENT'>();
        
        set_caller_address(owner);
        
        let quantity: u256 = 5;
        let token_ids = dispatcher.mint_batch(recipient, quantity);
        
        assert(token_ids.len() == 5, 'Should mint 5 tokens');
        assert(*token_ids.at(0) == 1, 'First token wrong');
        assert(*token_ids.at(4) == 5, 'Last token wrong');
        assert(erc721_dispatcher.balance_of(recipient) == 5, 'Balance should be 5');
    }

    #[test]
    #[should_panic(expected: ('Only owner can mint',))]
    fn test_mint_only_owner() {
        let (_, dispatcher, _) = setup();
        let unauthorized = contract_address_const::<'UNAUTHORIZED'>();
        let recipient = contract_address_const::<'RECIPIENT'>();
        
        set_caller_address(unauthorized);
        
        let token_uri: ByteArray = "ipfs://QmTest123";
        dispatcher.mint(recipient, token_uri);
    }

    #[test]
    fn test_transfer_ownership() {
        let (owner, dispatcher, _) = setup();
        let new_owner = contract_address_const::<'NEW_OWNER'>();
        
        set_caller_address(owner);
        dispatcher.transfer_ownership(new_owner);
        
        assert(dispatcher.get_owner() == new_owner, 'Ownership not transferred');
    }

    #[test]
    #[should_panic(expected: ('Only owner can transfer',))]
    fn test_transfer_ownership_only_owner() {
        let (_, dispatcher, _) = setup();
        let unauthorized = contract_address_const::<'UNAUTHORIZED'>();
        let new_owner = contract_address_const::<'NEW_OWNER'>();
        
        set_caller_address(unauthorized);
        dispatcher.transfer_ownership(new_owner);
    }

    #[test]
    fn test_set_base_uri() {
        let (owner, dispatcher, _) = setup();
        let new_base_uri: ByteArray = "https://newuri.com/";
        
        set_caller_address(owner);
        dispatcher.set_base_uri(new_base_uri.clone());
        
        let stored_uri = dispatcher.get_base_uri();
        assert(stored_uri == new_base_uri, 'Base URI not updated');
    }

    #[test]
    fn test_erc721_transfer() {
        let (owner, dispatcher, erc721_dispatcher) = setup();
        let recipient = contract_address_const::<'RECIPIENT'>();
        let new_owner = contract_address_const::<'NEW_OWNER'>();
        
        set_caller_address(owner);
        
        let token_uri: ByteArray = "ipfs://QmTest123";
        let token_id = dispatcher.mint(recipient, token_uri);
        
        // Transfer from recipient to new_owner
        set_caller_address(recipient);
        erc721_dispatcher.transfer_from(recipient, new_owner, token_id);
        
        assert(erc721_dispatcher.owner_of(token_id) == new_owner, 'Transfer failed');
        assert(erc721_dispatcher.balance_of(recipient) == 0, 'Sender balance wrong');
        assert(erc721_dispatcher.balance_of(new_owner) == 1, 'Receiver balance wrong');
    }
}

