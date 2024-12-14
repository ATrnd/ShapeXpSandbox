import { getShapeXpContract, getShapeXpNFTContract } from '../contracts/contract-instances';
import { NFTMetadata, fetchUserNFTs } from '../features/nft/nft-fetching';
import { InventorySlot, InventoryData, fetchInventory } from '../features/nft/inventory';
import { AddToInventoryResult, addToInventory } from '../features/nft/inventory-actions';
import { NFTExperienceResult, getNFTExperience } from '../features/nft/nft-experience';
import { Contract } from 'ethers';

export class ShapeXpHelpers {
    /**
     * Check if an address owns a ShapeXp NFT
     * @param address - Ethereum address to check
     * @returns Promise<boolean> - true if address owns ShapeXp, false otherwise
     * @example
     * const hasShapeXp = await ShapeXpHelpers.ownsShapeXp("0x123...")
     */
    public static async ownsShapeXp(address: string): Promise<boolean> {
        try {
            const nftContract = await getShapeXpNFTContract();
            const hasToken = await nftContract.hasMintedToken(address);
            return hasToken;
        } catch (error) {
            console.error('Error checking ShapeXp ownership:', error);
            return false;
        }
    }

    /**
     * Get the total experience amount for an address
     * @param address - Ethereum address to check
     * @returns Promise<{ experience: bigint, formatted: string }> - Experience amount and formatted string
     * @example
     * const exp = await ShapeXpHelpers.getExperience("0x123...")
     * console.log(`Experience: ${exp.formatted}`)
     */
    public static async getExperience(address: string): Promise<{
        experience: bigint,
        formatted: string
    }> {
        try {
            const contract = await getShapeXpContract();
            const experience = await contract.getGlobalExperience(address);

            return {
                experience,
                formatted: experience.toString()
            };
        } catch (error) {
            console.error('Error fetching experience:', error);
            throw error;
        }
    }

    /**
     * Get both ownership and experience data for an address in one call
     * @param address - Ethereum address to check
     * @returns Promise containing ownership and experience data
     * @example
     * const data = await ShapeXpHelpers.getShapeXpData("0x123...")
     * if (data.ownsShapeXp) {
     *   console.log(`Experience: ${data.experience.formatted}`)
     * }
     */
    public static async getShapeXpData(address: string): Promise<{
        ownsShapeXp: boolean;
        experience: {
            amount: bigint;
            formatted: string;
        } | null;
    }> {
        try {
            const hasToken = await this.ownsShapeXp(address);

            if (!hasToken) {
                return {
                    ownsShapeXp: false,
                    experience: null
                };
            }

            const exp = await this.getExperience(address);

            return {
                ownsShapeXp: true,
                experience: {
                    amount: exp.experience,
                    formatted: exp.formatted
                }
            };
        } catch (error) {
            console.error('Error fetching ShapeXp data:', error);
            throw error;
        }
    }

    /**
     * Fetch all NFTs owned by an address
     * @param address - Ethereum address to check
     * @returns Promise<NFTMetadata[]> Array of NFT data
     */
    public static async getNFTs(address: string): Promise<NFTMetadata[]> {
        try {
            return await fetchUserNFTs(address);
        } catch (error) {
            console.error('Error in getNFTs:', error);
            throw error;
        }
    }

    /**
     * Get inventory data for an address
     * @param address - Ethereum address to check
     * @returns Promise<InventoryData> Inventory data including slots
     */
    public static async getInventory(address: string): Promise<InventoryData> {
        try {
            return await fetchInventory(address);
        } catch (error) {
            console.error('Error getting inventory:', error);
            throw error;
        }
    }

    /**
     * Add an NFT to ShapeXp inventory
     * @param contractAddress - NFT contract address
     * @param tokenId - NFT token ID
     * @returns Promise<AddToInventoryResult>
     */
    public static async addNFTToInventory(
        contractAddress: string,
        tokenId: string
    ): Promise<AddToInventoryResult> {
        try {
            return await addToInventory(contractAddress, tokenId);
        } catch (error) {
            console.error('Error adding NFT to inventory:', error);
            throw error;
        }
    }

    /**
     * Get experience points for a specific NFT
     * @param contractAddress - NFT contract address
     * @param tokenId - NFT token ID
     * @returns Promise<NFTExperienceResult> Experience data
     */
    public static async getNFTExperience(
        contractAddress: string,
        tokenId: string
    ): Promise<NFTExperienceResult> {
        try {
            return await getNFTExperience(contractAddress, tokenId);
        } catch (error) {
            console.error('Error getting NFT experience:', error);
            throw error;
        }
    }
}
