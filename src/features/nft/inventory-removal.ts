// src/features/nft/inventory-removal.ts
import { getShapeXpContract } from '../../contracts/contract-instances';
import { ContractTransactionResponse } from 'ethers';

export interface RemoveFromInventoryResult {
    success: boolean;
    error?: string;
    tx?: ContractTransactionResponse;
}

export async function removeFromInventory(
    contractAddress: string,
    tokenId: string
): Promise<RemoveFromInventoryResult> {
    try {
        const contract = await getShapeXpContract();
        console.log('Removing NFT from inventory:', { contractAddress, tokenId });

        const tx = await contract.removeNFTFromInventory(contractAddress, tokenId);
        await tx.wait();

        return {
            success: true,
            tx
        };
    } catch (error: any) {
        console.log('Error removing NFT from inventory:', error);
        return {
            success: false,
            error: error.message || 'Failed to remove NFT from inventory'
        };
    }
}
