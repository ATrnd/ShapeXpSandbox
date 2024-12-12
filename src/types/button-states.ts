export enum ButtonState {
    // Generic States
    DEFAULT = 'default',
    PROGRESS = 'progress',
    COMPLETED = 'completed',

    // Mint-specific States
    MINTING = 'minting',
    MINTED = 'minted',

    // Experience-specific States
    GAINING = 'gaining',
    GAINED = 'gained'
}

export enum ExperienceAmount {
    LOW,
    MID,
    HIGH
}
