/**
* @title ShapeXp Helper Usage Examples
* @notice Demonstrates usage patterns for ShapeXp utility functions
* @dev Example implementations of ShapeXpHelpers class methods
* @custom:module-hierarchy Documentation/Examples
*/

import { ShapeXpHelpers } from '../utils/shapexp-helpers';

/**
* @notice Example implementation of ShapeXp helper functions
* @dev Demonstrates all main helper functionalities
* @custom:examples
* - NFT ownership check
* - Experience retrieval
* - Combined data fetch
*/
async function example() {
    const address = "0xbe0d3F1D8E318dca82f860Dd7aDDc1149DD06662"; // The address to check

   /**
    * @notice Example wallet address for demonstration
    * @dev Replace with actual address in implementation
    */
    const hasShapeXp = await ShapeXpHelpers.ownsShapeXp(address);
    console.log('Has ShapeXp:', hasShapeXp);

   /**
    * @notice Example 2: Experience Retrieval
    * @dev Demonstrates experience data fetching with error handling
    * @custom:returns
    * - experience: Raw bigint value
    * - formatted: String formatted value
    */
    try {
        const exp = await ShapeXpHelpers.getExperience(address);
        console.log('Experience:', exp.formatted);
    } catch (error) {
        console.error('Error getting experience:', error);
    }

   /**
    * @notice Example 3: Combined Data Retrieval
    * @dev Demonstrates comprehensive data fetch with ownership and experience
    * @custom:returns
    * - ownsShapeXp: Boolean
    * - experience: Optional experience data
    */
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
