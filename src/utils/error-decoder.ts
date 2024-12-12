import { Interface } from 'ethers';
import { ShapeXpErrorSignatures, OnCooldownError } from '../types/contract-errors';

export function parseShapeXpError(error: any): string {
    // Check if error contains data property
    if (!error.data) {
        return error.message;
    }

    try {
        // Create interface instance to decode errors
        const iface = new Interface([
            `error ${ShapeXpErrorSignatures.OnCooldown}`,
            `error ${ShapeXpErrorSignatures.NotShapeXpNFTOwner}`,
            `error ${ShapeXpErrorSignatures.InvalidExperienceType}`
        ]);

        // Extract error data
        const errorData = error.data;

        // Try to decode the error
        const decodedError = iface.parseError(errorData);

        if (!decodedError) {
            return 'Unknown contract error';
        }

        // Format time for cooldown error
        function formatTimeRemaining(seconds: bigint): string {
            const totalSeconds = Number(seconds);
            const minutes = Math.floor(totalSeconds / 60);
            const remainingSeconds = totalSeconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }

        // Handle specific error types
        switch(decodedError.name) {
            case 'ShapeXpInvExp__OnCooldown': {
                const { timeRemaining } = decodedError.args as unknown as OnCooldownError;
                return `Please wait ${formatTimeRemaining(timeRemaining)} before gaining more experience`;
            }
            case 'ShapeXpInvExp__NotShapeXpNFTOwner':
                return 'You need to own a ShapeXp NFT to gain experience';
            case 'ShapeXpInvExp__InvalidExperienceType':
                return 'Invalid experience type selected';
            default:
                return `Contract error: ${decodedError.name}`;
        }
    } catch (parseError) {
        console.error('Error parsing contract error:', parseError);
        return error.message;
    }
}
