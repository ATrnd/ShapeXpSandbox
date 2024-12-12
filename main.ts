import './style.css'
import { AppState } from './src/state/state-store'
import { WalletConnection } from './src/features/wallet/connection'
import { ExperienceManager } from './src/features/experience/experience-manager';


// Initialize app state
const appState = AppState.getInstance();

// Initialize wallet connection
const walletConnection = new WalletConnection();
const experienceManager = new ExperienceManager();

// For debugging
(window as any).appState = appState;
