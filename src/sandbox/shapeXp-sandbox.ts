// Example usage:

// 1. Import the helpers
import { ShapeXpHelpers } from '../utils/shapexp-helpers';

// 2. Use the functions
async function example() {
    const address = "0xbe0d3F1D8E318dca82f860Dd7aDDc1149DD06662"; // The address to check

    // Check if address owns ShapeXp
    const hasShapeXp = await ShapeXpHelpers.ownsShapeXp(address);
    console.log('Has ShapeXp:', hasShapeXp);

    // Get experience amount
    try {
        const exp = await ShapeXpHelpers.getExperience(address);
        console.log('Experience:', exp.formatted);
    } catch (error) {
        console.error('Error getting experience:', error);
    }

    // Get all data in one call
    try {
        const data = await ShapeXpHelpers.getShapeXpData(address);
        if (data.ownsShapeXp) {
            console.log('Has ShapeXp with experience:', data.experience?.formatted);
        } else {
            console.log('Address does not own ShapeXp');
        }
    } catch (error) {
        console.error('Error getting ShapeXp data:', error);
    }
}
