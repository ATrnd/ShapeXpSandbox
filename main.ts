import './style.css'
import { AppState } from './src/state/state-store'
import { WalletConnection } from './src/features/wallet/connection'

// Initialize app state
const appState = AppState.getInstance();

// Initialize wallet connection
const walletConnection = new WalletConnection();

// For debugging
(window as any).appState = appState;
