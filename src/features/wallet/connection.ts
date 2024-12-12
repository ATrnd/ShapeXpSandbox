import { AppState } from '../../state/state-store';
import { ButtonState } from '../../types/button-states';

export class WalletConnection {
    private appState: AppState;
    private readonly CONNECT_BUTTON_ID = 'ShapeXpSandboxConnect';

    constructor() {
        console.log('Initializing WalletConnection');
        console.log('-----------------------------');
        this.appState = AppState.getInstance();
        this.initializeConnection();
        this.checkExistingConnection();
        this.setupEventListeners();
        this.setupDisabledClickHandler();
    }

    private setupDisabledClickHandler() {
        const connectButton = document.getElementById(this.CONNECT_BUTTON_ID);
        if (!connectButton) return;

        connectButton.addEventListener('click', (_) => {
            if (this.appState.getIsConnected()) {
                console.log('already connected, connection disabled');
            }
        });
    }

    private async initializeConnection() {
        const connectButton = document.getElementById(this.CONNECT_BUTTON_ID);
        if (!connectButton || !window.ethereum || !window.ethereum.request) return;

        connectButton.addEventListener('click', async () => {
            if (this.appState.getIsConnected()) return;
            try {
                if (!window.ethereum || !window.ethereum.request) {
                    throw new Error('Ethereum provider not found');
                }

                // Show loading state
                this.appState.updateConnectButtonState(ButtonState.PROGRESS);

                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                }) as string[];

                this.appState.updateConnection(true, accounts[0]);
                console.log('Connected:', accounts[0]);

            } catch (error) {
                console.error('Connection error:', error);
                this.appState.updateConnection(false);
                this.appState.updateConnectButtonState(ButtonState.DEFAULT);
            } finally {
                // Hide loading state
                this.setButtonLoading(this.CONNECT_BUTTON_ID, false);
            }
        });
    }

    private setupEventListeners() {
        if (!window.ethereum?.on) return;

        window.ethereum.on('accountsChanged', async (accounts: string[]) => {
            if (accounts.length === 0) {
                this.appState.updateConnection(false);
                // console.log('Disconnected');
            } else {
                this.appState.updateConnection(true, accounts[0]);
                console.log('Account changed:', accounts[0]);
            }
        });

        window.ethereum.on('disconnect', () => {
            this.appState.updateConnection(false);
            console.log('Wallet disconnected');
        });
    }

    private async checkExistingConnection() {
        if (!window.ethereum?.request) return;

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            }) as string[];

            if (accounts.length > 0) {
                this.appState.updateConnection(true, accounts[0]);
                console.log('Found existing connection:', accounts[0]);
            }
        } catch (error) {
            console.error('Error checking existing connection:', error);
        }
    }

    private setButtonLoading(buttonId: string, isLoading: boolean) {
        const button = document.getElementById(buttonId);
        const loadingIndicator = button?.nextElementSibling as HTMLElement;

        if (button && loadingIndicator) {
            if (isLoading) {
                button.setAttribute('disabled', 'true');
                loadingIndicator.classList.remove('hidden');
            } else {
                button.removeAttribute('disabled');
                loadingIndicator.classList.add('hidden');
            }
        }
    }
}
