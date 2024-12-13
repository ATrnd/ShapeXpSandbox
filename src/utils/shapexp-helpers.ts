import { getShapeXpContract, getShapeXpNFTContract } from '../contracts/contract-instances';
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
}
