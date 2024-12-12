// src/state/state-store.ts
import { ButtonState } from '../types/button-states';

export class AppState {
    private static instance: AppState;
    private isConnected: boolean = false;
    private userAddress: string | null = null;

    // Default button classes
    private readonly buttonBaseClasses = 'w-[280px] h-[41px] border-2 border-[#FF7272] rounded-lg uppercase text-base transition-all duration-300 ease-in-out hover:border-orange-600 hover:scale-105';

    private readonly connectedButtonClasses = 'w-[280px] h-[41px] border-2 rounded-lg uppercase text-base text-white transition-all duration-300 ease-in-out border-[#AAFF72] opacity-50 cursor-not-allowed';

    private readonly progressButtonClasses = 'w-[280px] h-[41px] border-2 border-[#FF7272] rounded-lg uppercase text-base transition-all duration-300 ease-in-out opacity-75';

    // Buttons that require connection
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

        if (isConnected && address) {
            console.log('--- Connected ---');
            this.enableButtons();
            this.updateConnectButtonState(ButtonState.COMPLETED);
        } else {
            // Handle disconnection
            console.log('--- Disconnected ---');
            this.disableButtons(); // Disable all feature buttons
            this.updateConnectButtonState(ButtonState.DEFAULT);
        }
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
