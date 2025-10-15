"use client"

import { NFTContractTest } from "@/components/nft-contract-test"

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prueba de Integración NFT</h1>
          <p className="text-gray-600">
            Prueba la integración del contrato NFT NearMint con Starknet Mainnet
          </p>
        </div>
        
        <NFTContractTest />
      </div>
    </div>
  )
}
