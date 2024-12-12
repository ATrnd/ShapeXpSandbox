export const ButtonClasses = {
    // Base classes
    base: 'w-[280px] h-[41px] border-2 rounded-lg uppercase text-base transition-all duration-300 ease-in-out',

    // State classes
    default: 'border-[#FF7272] hover:border-orange-600 hover:scale-105',
    disabled: 'opacity-50 cursor-not-allowed',
    progress: 'border-[#FF7272] opacity-75',

    // Success state classes
    connected: 'border-[#AAFF72] text-white',
    minted: 'border-[#AAFF72] text-white',
    gained: 'border-[#FFFF72] text-white',

    // Additional combinations
    defaultWithDisabled: 'border-[#FF7272] disabled:opacity-50 disabled:cursor-not-allowed',

    // Helper functions
    combine: (...classes: string[]) => {
        return [ButtonClasses.base, ...classes].join(' ');
    },

    getDefaultClasses: () => ButtonClasses.combine(ButtonClasses.default),
    getProgressClasses: () => ButtonClasses.combine(ButtonClasses.progress),
    getConnectedClasses: () => ButtonClasses.combine(ButtonClasses.connected, ButtonClasses.disabled),
    getMintedClasses: () => ButtonClasses.combine(ButtonClasses.minted, ButtonClasses.disabled),
    // getGainedClasses: () => ButtonClasses.combine(ButtonClasses.gained, ButtonClasses.disabled),
    getDisabledClasses: () => ButtonClasses.combine(ButtonClasses.defaultWithDisabled),
};
