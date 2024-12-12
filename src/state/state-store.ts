// src/state/state-store.ts
import { ButtonState, MintButtonState} from '../types/button-states';

export class AppState {
    private static instance: AppState;
    private isConnected: boolean = false;
    private userAddress: string | null = null;
    private hasNFT: boolean = false;

    // button classes
    private readonly buttonBaseClasses = 'w-[280px] h-[41px] border-2 border-[#FF7272] rounded-lg uppercase text-base transition-all duration-300 ease-in-out hover:border-orange-600 hover:scale-105';
    private readonly connectedButtonClasses = 'w-[280px] h-[41px] border-2 rounded-lg uppercase text-base text-white transition-all duration-300 ease-in-out border-[#AAFF72] opacity-50 cursor-not-allowed';
    private readonly progressButtonClasses = 'w-[280px] h-[41px] border-2 border-[#FF7272] rounded-lg uppercase text-base transition-all duration-300 ease-in-out opacity-75';
    private readonly mintedButtonClasses = 'w-[280px] h-[41px] border-2 rounded-lg uppercase text-base text-white transition-all duration-300 ease-in-out border-[#AAFF72] opacity-50 cursor-not-allowed';
    private readonly mintButtonBaseClasses = 'w-[280px] h-[41px] border-2 border-[#FF7272] rounded-lg uppercase text-base transition-all duration-300 ease-in-out hover:border-orange-600 hover:scale-105';
    private readonly mintingButtonClasses = 'w-[280px] h-[41px] border-2 border-[#FF7272] rounded-lg uppercase text-base transition-all duration-300 ease-in-out opacity-75';

    // Buttons that require connection
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
            // If user has NFT, disable mint button and enable others
            if (mintButton) {
                mintButton.className = this.connectedButtonClasses;
                mintButton.setAttribute('disabled', 'true');
            }

            this.restrictedButtons.forEach(buttonId => {
                if (buttonId !== 'ShapeXpSandboxMint') {
                    const button = document.getElementById(buttonId);
                    if (button) {
                        button.className = this.buttonBaseClasses;
                        button.removeAttribute('disabled');
                    }
                }
            });
        } else {
            // If user doesn't have NFT, enable only mint button
            if (mintButton) {
                mintButton.className = this.buttonBaseClasses;
                mintButton.removeAttribute('disabled');
            }

            this.restrictedButtons.forEach(buttonId => {
                if (buttonId !== 'ShapeXpSandboxMint') {
                    const button = document.getElementById(buttonId);
                    if (button) {
                        button.className = `${this.buttonBaseClasses} disabled:opacity-50 disabled:cursor-not-allowed`;
                        button.setAttribute('disabled', 'true');
                    }
                }
            });
        }
    }

//     private updateButtonStates() {
//         const mintButton = document.getElementById(this.MINT_BUTTON_ID);
//
//         if (this.isConnected) {
//             if (this.hasNFT) {
//                 // If has NFT, enable NFT-dependent buttons and disable mint
//                 if (mintButton) {
//                     mintButton.className = this.mintedButtonClasses;
//                     mintButton.setAttribute('disabled', 'true');
//                 }
//                 this.nftDependentButtons.forEach(buttonId => {
//                     const button = document.getElementById(buttonId);
//                     if (button) {
//                         button.className = this.buttonBaseClasses;
//                         button.removeAttribute('disabled');
//                     }
//                 });
//             } else {
//                 // If no NFT, enable only mint button
//                 if (mintButton) {
//                     mintButton.className = this.buttonBaseClasses;
//                     mintButton.removeAttribute('disabled');
//                 }
//                 this.nftDependentButtons.forEach(buttonId => {
//                     const button = document.getElementById(buttonId);
//                     if (button) {
//                         button.className = `${this.buttonBaseClasses} disabled:opacity-50 disabled:cursor-not-allowed`;
//                         button.setAttribute('disabled', 'true');
//                     }
//                 });
//             }
//         } else {
//             // If not connected, disable all buttons
//             [...this.nftDependentButtons, this.MINT_BUTTON_ID].forEach(buttonId => {
//                 const button = document.getElementById(buttonId);
//                 if (button) {
//                     button.className = `${this.buttonBaseClasses} disabled:opacity-50 disabled:cursor-not-allowed`;
//                     button.setAttribute('disabled', 'true');
//                 }
//             });
//         }
//     }

    private initializeButtonStates() {
        // Set initial states for restricted buttons
        this.restrictedButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.className = 'w-[280px] h-[41px] border-2 border-[#FF7272] rounded-lg uppercase text-base disabled:opacity-50 disabled:cursor-not-allowed';
                button.setAttribute('disabled', 'true');
            }
        });

        // Initialize connect button
        const connectButton = document.getElementById('ShapeXpSandboxConnect');
        if (connectButton) {
            connectButton.className = this.buttonBaseClasses;
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
                button.className = this.buttonBaseClasses;
                button.removeAttribute('disabled');
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                break;

            case ButtonState.PROGRESS:
                button.textContent = 'Connecting...';
                button.className = this.progressButtonClasses;
                button.setAttribute('disabled', 'true');
                if (loadingIndicator) loadingIndicator.classList.remove('hidden');
                break;

            case ButtonState.COMPLETED:
                button.textContent = 'Connected';
                button.className = this.connectedButtonClasses;
                button.setAttribute('disabled', 'true');
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                break;
        }
    }

    public updateMintButtonState(state: MintButtonState) {
        const mintButton = document.getElementById('ShapeXpSandboxMint');
        if (!mintButton) return;

        const loadingIndicator = mintButton.nextElementSibling as HTMLElement;

        switch (state) {
            case MintButtonState.DEFAULT:
                mintButton.textContent = 'Mint ShapeXp';
                mintButton.className = this.mintButtonBaseClasses;
                mintButton.removeAttribute('disabled');
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                break;

            case MintButtonState.MINTING:
                mintButton.textContent = 'Minting...';
                mintButton.className = this.mintingButtonClasses;
                mintButton.setAttribute('disabled', 'true');
                if (loadingIndicator) loadingIndicator.classList.remove('hidden');
                break;

            case MintButtonState.MINTED:
                mintButton.textContent = 'Minted';
                mintButton.className = this.mintedButtonClasses;
                mintButton.setAttribute('disabled', 'true');
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                break;
        }
    }

    private enableButtons() {
        this.restrictedButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.className = this.buttonBaseClasses;
                button.removeAttribute('disabled');
            }
        });
    }

    private disableButtons() {
        this.restrictedButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.className = 'w-[280px] h-[41px] border-2 border-[#FF7272] rounded-lg uppercase text-base disabled:opacity-50 disabled:cursor-not-allowed';
                button.setAttribute('disabled', 'true');
            }
        });
    }

    public getIsConnected(): boolean {
        return this.isConnected;
    }

    public getUserAddress(): string | null {
        return this.userAddress;
    }
}
