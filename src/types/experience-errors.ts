/**
 * @title Experience Error Types
 * @notice Type definitions for ShapeXp experience system errors
 * @dev Includes interfaces and constant definitions for error handling
 */

/**
 * @notice Interface for OnCooldown error data
 * @dev Contains remaining cooldown time in seconds
 */
export interface OnCooldownError {
    timeRemaining: bigint;
}

/**
 * @notice Error signature constants for experience-related errors
 * @dev Used for error parsing and identification
 */
export const ExperienceErrorSignatures = {
    OnCooldown: "ShapeXpInvExp__OnCooldown(uint256)",
    NotShapeXpNFTOwner: "ShapeXpInvExp__NotShapeXpNFTOwner()",
    InvalidExperienceType: "ShapeXpInvExp__InvalidExperienceType()",
    InsufficientGlobalExperience: "ShapeXpInvExp__InsufficientGlobalExperience()"
} as const;

/**
 * @notice Human-readable error messages for experience system
 * @dev Maps error types to user-friendly messages
 */
export const ExperienceErrorMessages = {
    OnCooldown: (timeRemaining: string) => `Experience gain on cooldown. Please wait ${timeRemaining}`,
    NotShapeXpNFTOwner: "ShapeXp NFT ownership required for experience gains",
    InvalidExperienceType: "Invalid experience gain type specified",
    InsufficientGlobalExperience: "Insufficient global experience points",
    UserRejected: "User rejected the experience transaction",
    TransactionTimeout: "Experience transaction timed out",
    Unknown: "An unknown error occurred while adding experience"
} as const;

/**
 * @notice Experience error codes for developer reference
 * @dev Standardized error codes for experience system
 */
export const ExperienceErrorCodes = {
    ON_COOLDOWN: 'EXP_ON_COOLDOWN',
    NOT_NFT_OWNER: 'EXP_NOT_NFT_OWNER',
    INVALID_TYPE: 'EXP_INVALID_TYPE',
    INSUFFICIENT_EXPERIENCE: 'EXP_INSUFFICIENT',
    USER_REJECTED: 'EXP_USER_REJECTED',
    TRANSACTION_TIMEOUT: 'EXP_TX_TIMEOUT',
    UNKNOWN: 'EXP_UNKNOWN_ERROR'
} as const;
