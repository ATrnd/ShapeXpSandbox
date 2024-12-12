import { AppState } from '../../state/state-store';
import { checkShapeXpNFTOwnership } from './validation';

export class ShapeXpManager {
    private appState: AppState;
    private readonly MINT_BUTTON_ID = 'ShapeXpSandboxMint';

    constructor() {
        this.appState = AppState.getInstance();
        this.setupMintButtonListener();
    }

    private setupMintButtonListener() {
        const mintButton = document.getElementById(this.MINT_BUTTON_ID);
        if (!mintButton) return;

        mintButton.addEventListener('click', () => {
            if (this.appState.getHasNFT()) {
                console.log('owns shapeXpNFT');
            } else {
                console.log('has no shapeXpNFT');
            }
        });
    }

    public async checkShapeXpOwnership() {
        try {
            const hasNFT = await checkShapeXpNFTOwnership();
            this.appState.updateNFTStatus(hasNFT);
        } catch (error) {
            console.error('Error in NFT check:', error);
            this.appState.updateNFTStatus(false);
        }
    }
}
