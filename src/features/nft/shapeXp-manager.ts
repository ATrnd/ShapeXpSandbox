import { AppState } from '../../state/state-store';
import { checkShapeXpNFTOwnership } from './validation';
import { getShapeXpNFTContract } from '../../contracts/contract-instances';
import { ButtonState } from '../../types/button-states';

export class ShapeXpManager {
    private appState: AppState;
    private readonly MINT_BUTTON_ID = 'ShapeXpSandboxMint';
    private isMinting: boolean = false;

    constructor() {
        this.appState = AppState.getInstance();
        this.setupMintButtonHandler();
    }

    private setupMintButtonHandler() {
        const mintButton = document.getElementById(this.MINT_BUTTON_ID);
        if (!mintButton) return;

        mintButton.addEventListener('click', async () => {
            if (this.appState.getHasNFT()) {
                console.log('already minted, minting disabled');
                return;
            }

            if (this.isMinting) {
                console.log('Minting already in progress');
                return;
            }

            try {
                await this.handleMint();
            } catch (error) {
                console.error('Error in mint process:', error);
                this.appState.updateMintButtonState(ButtonState.DEFAULT);
            }
        });
    }

    private async handleMint() {
        this.isMinting = true;
        this.appState.updateMintButtonState(ButtonState.MINTING);

        try {
            console.log('Initiating mint process...');
            const nftContract = await getShapeXpNFTContract();

            console.log('Calling ShapeXpNFT mint function');
            const tx = await nftContract.mint();
            console.log('Mint transaction sent:', tx.hash);

            console.log('Waiting for transaction confirmation');
            const receipt = await tx.wait(1);
            console.log('Transaction confirmed:', receipt);

            await this.checkShapeXpOwnership();
            this.appState.updateMintButtonState(ButtonState.MINTED);

            return tx;
        } catch (error: any) {
            console.error('Minting error:', {
                message: error.message,
                code: error.code,
                data: error.data,
                transaction: error.transaction
            });
            this.appState.updateMintButtonState(ButtonState.DEFAULT);
            throw error;
        } finally {
            this.isMinting = false;
        }
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
