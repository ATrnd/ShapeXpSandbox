import { AppState } from '../../state/state-store';
import { checkShapeXpNFTOwnership } from './validation';
import { getShapeXpNFTContract } from '../../contracts/contract-instances';
import { ButtonState } from '../../types/button-states';
import { ButtonClasses } from '../../state/button-classes';
import { getGlobalExperience } from '../experience/experience-tracking';

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
            console.log('1. Initiating mint process...');
            const nftContract = await getShapeXpNFTContract();
            console.log('2. Got NFT contract:', nftContract.target);

            console.log('3. Estimating gas...');
            const gasLimit = await nftContract.mint.estimateGas();
            console.log('4. Estimated gas:', gasLimit.toString());

            console.log('5. Calling ShapeXpNFT mint function');
            const tx = await nftContract.mint({
                gasLimit: gasLimit * BigInt(12) / BigInt(10) // Add 20% buffer
            });
            console.log('6. Mint transaction sent:', tx.hash);

            console.log('7. Waiting for transaction confirmation...');
            const receipt = await tx.wait(1);
            console.log('8. Transaction confirmed:', receipt.hash);

            // Add delay to allow chain state to update
            console.log('9. Waiting for chain state update...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            console.log('10. Checking ownership...');
            await this.checkShapeXpOwnership();

            console.log('11. Setting minted state...');
            this.appState.updateMintButtonState(ButtonState.MINTED);

            return tx;
        } catch (error: any) {
            console.error('Minting error:', {
                message: error.message,
                code: error.code,
                data: error.data,
                transaction: error.transaction,
                // Add stack trace for debugging
                stack: error.stack
            });
            this.appState.updateMintButtonState(ButtonState.DEFAULT);
            throw error;
        } finally {
            this.isMinting = false;
        }
    }

    public async checkShapeXpOwnership() {
        try {

            console.log('Checking ShapeXp ownership...');
            const hasNFT = await checkShapeXpNFTOwnership();
            console.log('Has NFT:', hasNFT);
            this.appState.updateNFTStatus(hasNFT);

            if (hasNFT) {
                console.log('Fetching experience...');
                const { experience, formattedExperience } = await getGlobalExperience();
                console.log('Experience fetched:', formattedExperience);
                this.appState.updateExperience(experience, formattedExperience);
                this.updateExperienceDisplay(formattedExperience);
            } else {
                this.updateExperienceDisplay('0');

                const mintButton = document.getElementById(this.MINT_BUTTON_ID);
                if (mintButton) {
                    mintButton.className = ButtonClasses.getDefaultClasses();
                    mintButton.removeAttribute('disabled');
                }
            }
        } catch (error) {
            console.error('Error in NFT check:', error);
            this.appState.updateNFTStatus(false);
            this.updateExperienceDisplay('0');
        }
    }

    private updateExperienceDisplay(amount: string) {
        const expElement = document.getElementById('ShapeXpAmount');
        if (expElement) {
            expElement.textContent = `shapexp: ${amount}`;
        }
    }
}
