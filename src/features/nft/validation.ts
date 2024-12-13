// src/features/nft/validation.ts
import { getCurrentAddress } from '../../utils/provider';
import { getShapeXpNFTContract } from '../../contracts/contract-instances';

export async function checkShapeXpNFTOwnership(): Promise<boolean> {
    try {
        const nftContract = await getShapeXpNFTContract();
        const userAddress = await getCurrentAddress();

        console.log('Checking NFT ownership for:', {
            contract: nftContract.target,
            user: userAddress
        });

        const hasMinted = await nftContract.hasMintedToken(userAddress);
        console.log('hasMintedToken result:', hasMinted);
        return hasMinted;

    } catch (error: any) {
        // If the contract call reverts, it means they don't have the token
        console.log('No ShapeXp token found for user');
        return false;
    }
}
