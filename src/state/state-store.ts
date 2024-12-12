// src/state/state-store.ts
// import { ButtonState, MintButtonState, ExperienceButtonState} from '../types/button-states';

import { ButtonState } from '../types/button-states';
import { ButtonClasses } from './button-classes';

interface ButtonConfig {
    id: string;
    states: {
        [key in ButtonState]?: {
            text: string;
            classes: string[];
        };
    };
}

export class AppState {
    private static instance: AppState;
    private isConnected: boolean = false;
    private userAddress: string | null = null;
    private hasNFT: boolean = false;
    private experience: bigint = BigInt(0);
    private formattedExperience: string = '0';

    private readonly buttonConfigs: { [key: string]: ButtonConfig } = {
        connect: {
            id: 'ShapeXpSandboxConnect',
            states: {
                [ButtonState.DEFAULT]: {
                    text: 'Connect',
                    classes: [ButtonClasses.default]
                },
                [ButtonState.PROGRESS]: {
                    text: 'Connecting...',
                    classes: [ButtonClasses.progress]
                },
                [ButtonState.COMPLETED]: {
                    text: 'Connected',
                    classes: [ButtonClasses.connected, ButtonClasses.disabled]
                }
            }
        },
        mint: {
            id: 'ShapeXpSandboxMint',
            states: {
                [ButtonState.DEFAULT]: {
                    text: 'Mint ShapeXp',
                    classes: [ButtonClasses.default]
                },
                [ButtonState.MINTING]: {
                    text: 'Minting...',
                    classes: [ButtonClasses.progress]
                },
                [ButtonState.MINTED]: {
                    text: 'Minted',
                    classes: [ButtonClasses.minted, ButtonClasses.disabled]
                }
            }
        }
    };

    // Unified button state update method
    public updateButtonState(buttonType: string, state: ButtonState) {
        const config = this.buttonConfigs[buttonType];
        if (!config) return;

        const button = document.getElementById(config.id);
        if (!button) return;

        const loadingIndicator = button.nextElementSibling as HTMLElement;
        const stateConfig = config.states[state];

        if (stateConfig) {
            button.textContent = stateConfig.text;
            button.className = ButtonClasses.combine(...stateConfig.classes);

            if (state === ButtonState.PROGRESS) {
                button.setAttribute('disabled', 'true');
                if (loadingIndicator) loadingIndicator.classList.remove('hidden');
            } else {
                if ([ButtonState.COMPLETED, ButtonState.MINTED, ButtonState.GAINED].includes(state)) {
                    button.setAttribute('disabled', 'true');
                } else {
                    button.removeAttribute('disabled');
                }
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
            }
        }
    }

    private readonly MINT_BUTTON_ID = 'ShapeXpSandboxMint';
    private restrictedButtons = [
        'ShapeXpSandboxMint',
        'ShapeXpSandboxXpLow',
        'ShapeXpSandboxXpMid',
        'ShapeXpSandboxXpHigh',
        'ShapeXpSandboxXpLookup'
    ];

    private constructor() {
        this.initializeButtonStates();
    }

    public static getInstance(): AppState {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }
        return AppState.instance;
    }

    public updateNFTStatus(hasNFT: boolean) {
        this.hasNFT = hasNFT;
        console.log('NFT status updated:', hasNFT);
        this.updateButtonsBasedOnNFT();
    }

    private updateButtonsBasedOnNFT() {
        if (!this.isConnected) return;

        const mintButton = document.getElementById('ShapeXpSandboxMint');

        if (this.hasNFT) {
            if (mintButton) {
                mintButton.className = ButtonClasses.getConnectedClasses();
                mintButton.setAttribute('disabled', 'true');
            }

            this.restrictedButtons.forEach(buttonId => {
                if (buttonId !== 'ShapeXpSandboxMint') {
                    const button = document.getElementById(buttonId);
                    if (button) {
                        button.className = ButtonClasses.getDefaultClasses();
                        button.removeAttribute('disabled');
                    }
                }
            });
        } else {
            if (mintButton) {
                mintButton.className = ButtonClasses.getDefaultClasses();
                mintButton.removeAttribute('disabled');
            }

            this.restrictedButtons.forEach(buttonId => {
                if (buttonId !== 'ShapeXpSandboxMint') {
                    const button = document.getElementById(buttonId);
                    if (button) {
                        button.className = ButtonClasses.getDisabledClasses();
                        button.setAttribute('disabled', 'true');
                    }
                }
            });
        }
    }

    private initializeButtonStates() {
        this.restrictedButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.className = ButtonClasses.getDisabledClasses();
                button.setAttribute('disabled', 'true');
            }
        });

        const connectButton = document.getElementById('ShapeXpSandboxConnect');
        if (connectButton) {
            connectButton.className = ButtonClasses.getDefaultClasses();
        }
    }

    public updateConnection(isConnected: boolean, address: string | null = null) {
        this.isConnected = isConnected;
        this.userAddress = address;

        if (!isConnected) {
            this.hasNFT = false;
        }

        if (isConnected && address) {
            console.log('connected');
            this.updateConnectButtonState(ButtonState.COMPLETED);
        } else {
            this.disableButtons();
            this.updateConnectButtonState(ButtonState.DEFAULT);
        }
    }

    // Add getter for NFT status
    public getHasNFT(): boolean {
        return this.hasNFT;
    }

    public updateConnectButtonState(state: ButtonState) {
        const button = document.getElementById('ShapeXpSandboxConnect');
        if (!button) return;

        const loadingIndicator = button.nextElementSibling as HTMLElement;

        switch (state) {
            case ButtonState.DEFAULT:
                button.textContent = 'Connect';
            button.className = ButtonClasses.getDefaultClasses();
            button.removeAttribute('disabled');
            if (loadingIndicator) loadingIndicator.classList.add('hidden');
            break;

            case ButtonState.PROGRESS:
                button.textContent = 'Connecting...';
            button.className = ButtonClasses.getProgressClasses();
            button.setAttribute('disabled', 'true');
            if (loadingIndicator) loadingIndicator.classList.remove('hidden');
            break;

            case ButtonState.COMPLETED:
                button.textContent = 'Connected';
            button.className = ButtonClasses.getConnectedClasses();
            button.setAttribute('disabled', 'true');
            if (loadingIndicator) loadingIndicator.classList.add('hidden');
            break;
        }
    }

    public updateMintButtonState(state: ButtonState) {
        const mintButton = document.getElementById('ShapeXpSandboxMint');
        if (!mintButton) return;

        const loadingIndicator = mintButton.nextElementSibling as HTMLElement;

        switch (state) {
            case ButtonState.DEFAULT:
                mintButton.textContent = 'Mint ShapeXp';
                mintButton.className = ButtonClasses.getDefaultClasses();
                mintButton.removeAttribute('disabled');
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                break;

            case ButtonState.MINTING:
                mintButton.textContent = 'Minting...';
                mintButton.className = ButtonClasses.getProgressClasses();
                mintButton.setAttribute('disabled', 'true');
                if (loadingIndicator) loadingIndicator.classList.remove('hidden');
                break;

            case ButtonState.MINTED:
                mintButton.textContent = 'Minted';
                mintButton.className = ButtonClasses.getMintedClasses();
                mintButton.setAttribute('disabled', 'true');
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                break;
        }
    }

    public updateExperienceButtonState(buttonId: string, state: ButtonState) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const loadingIndicator = button.nextElementSibling as HTMLElement;
        const buttonType = buttonId.includes('Low') ? 'Low' : buttonId.includes('Mid') ? 'Mid' : 'High';

        switch (state) {
            case ButtonState.DEFAULT:
                button.textContent = `Gain ShapeXp ${buttonType}`;
                button.className = ButtonClasses.combine(ButtonClasses.default);
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                break;

            case ButtonState.GAINING:
                button.textContent = 'Gaining ShapeXp...';
                button.className = ButtonClasses.combine(ButtonClasses.progress);
                if (loadingIndicator) loadingIndicator.classList.remove('hidden');
                break;

            case ButtonState.GAINED:
                button.textContent = 'ShapeXp Added!';
                button.className = ButtonClasses.combine(ButtonClasses.gained);
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                break;
        }
    }

    private enableButtons() {
        this.restrictedButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.className = ButtonClasses.getDefaultClasses();
                button.removeAttribute('disabled');
            }
        });
    }

    private disableButtons() {
        this.restrictedButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.className = ButtonClasses.getDisabledClasses();
                button.setAttribute('disabled', 'true');
            }
        });
    }

    public updateExperience(experience: bigint, formattedExperience: string) {
        this.experience = experience;
        this.formattedExperience = formattedExperience;
        console.log('Experience updated:', {
            raw: experience.toString(),
            formatted: formattedExperience
        });
    }

    public getExperience(): bigint {
        return this.experience;
    }

    public getFormattedExperience(): string {
        return this.formattedExperience;
    }

    public getIsConnected(): boolean {
        return this.isConnected;
    }

    public getUserAddress(): string | null {
        return this.userAddress;
    }
}
