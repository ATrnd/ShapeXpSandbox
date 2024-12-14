// src/features/nft/nft-experience.ts
import { getShapeXpContract } from '../../contracts/contract-instances';
import { getCurrentAddress } from '../../utils/provider';

export interface NFTExperienceResult {
    experience: string;
    error?: string;
}

export async function getNFTExperience(
    contractAddress: string,
    tokenId: string
): Promise<NFTExperienceResult> {
    try {
        const contract = await getShapeXpContract();
        const userAddress = await getCurrentAddress();

        console.log('Fetching NFT experience for:', {
            user: userAddress,
            contract: contractAddress,
            tokenId: tokenId
        });

        const experience = await contract.getNFTExperience(
            userAddress,
            contractAddress,
            tokenId
        );

        return {
            experience: experience.toString()
        };
    } catch (error: any) {
        console.error('Error fetching NFT experience:', error);
        return {
            experience: '0',
            error: error.message || 'Failed to fetch NFT experience'
        };
    }
}
