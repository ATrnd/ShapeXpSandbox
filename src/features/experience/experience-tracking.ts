import { getShapeXpContract } from '../../contracts/contract-instances';
import { getCurrentAddress } from '../../utils/provider';

export async function getGlobalExperience(): Promise<{ experience: bigint, formattedExperience: string }> {
    try {
        console.log('--- Fetching global experience ---');
        const contract = await getShapeXpContract();
        const userAddress = await getCurrentAddress();

        console.log('Contract address: ', contract.target);
        console.log('User address: ', userAddress);

        if (typeof contract.getGlobalExperience !== 'function') {
            throw new Error('getGlobalExperience function not found in contract ABI');
        }

        const experience = await contract.getGlobalExperience(userAddress);
        console.log('Raw experience value: ', experience.toString());

        const formattedExperience = experience.toString();

        return {
            experience,
            formattedExperience
        };
    } catch (error: any) {
        console.error('Error fetching global experience:', {
            message: error.message,
            code: error.code,
            details: error
        });
        throw error;
    }
}
