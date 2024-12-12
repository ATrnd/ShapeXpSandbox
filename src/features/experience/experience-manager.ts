import { ButtonState, ExperienceAmount } from '../../types/button-states';
import { ButtonClasses } from '../../state/button-classes';
import { addGlobalExperience } from './experience-addition';
import { getGlobalExperience } from './experience-tracking';
import { LogManager } from '../../utils/log-manager';
import { AppState } from '../../state/state-store';
import { parseShapeXpError } from '../../utils/error-decoder.ts';
import { CooldownTimer } from '../../utils/cooldown-timer';

export class ExperienceManager {
    private appState: AppState;
    private isProcessing: boolean = false;
    private logManager: LogManager;
    private cooldownTimer: CooldownTimer;

    private readonly experienceButtons = [
        'ShapeXpSandboxXpLow',
        'ShapeXpSandboxXpMid',
        'ShapeXpSandboxXpHigh'
    ];

    private readonly experienceTypes = {
        'ShapeXpSandboxXpLow': ExperienceAmount.LOW,
        'ShapeXpSandboxXpMid': ExperienceAmount.MID,
        'ShapeXpSandboxXpHigh': ExperienceAmount.HIGH
    } as const;

    constructor() {
        this.logManager = LogManager.getInstance();
        this.appState = AppState.getInstance();
        this.cooldownTimer = CooldownTimer.getInstance();
        this.initializeExperienceButtons();
    }

    private initializeExperienceButtons() {
        Object.entries(this.experienceTypes).forEach(([buttonId, expType]) => {
            const button = document.getElementById(buttonId);
            if (!button) return;

            button.addEventListener('click', async () => {
                if (this.isProcessing) {
                    console.log('Experience gain already in progress');
                    return;
                }

                await this.handleExperienceAdd(buttonId, expType);
            });
        });
    }

    private disableAllExperienceButtons() {
        this.experienceButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.setAttribute('disabled', 'true');
                button.className = ButtonClasses.getProgressClasses();
            }
        });
    }

    private enableAllExperienceButtons() {
        this.experienceButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.removeAttribute('disabled');
                button.className = ButtonClasses.getDefaultClasses();
            }
        });
    }

    //private disableAllButtons() {
    //    this.experienceButtons.forEach(buttonId => {
    //        const button = document.getElementById(buttonId);
    //        if (button) {
    //            button.setAttribute('disabled', 'true');
    //        }
    //    });
    //}

    //private enableAllButtons() {
    //    this.experienceButtons.forEach(buttonId => {
    //        const button = document.getElementById(buttonId);
    //        if (button) {
    //            button.removeAttribute('disabled');
    //            this.appState.updateExperienceButtonState(buttonId, ButtonState.DEFAULT);
    //        }
    //    });
    //}

    private async handleExperienceAdd(buttonId: string, expType: ExperienceAmount) {
        if (this.isProcessing) return;

        try {
            this.isProcessing = true; // Set processing flag
            this.disableAllExperienceButtons(); // Disable all buttons

            // Update UI to show progress
            this.appState.updateExperienceButtonState(buttonId, ButtonState.GAINING);
            this.logManager.updateExperienceStatus('start');

            // Call contract
            await addGlobalExperience(expType);

            // Show success state
            this.appState.updateExperienceButtonState(buttonId, ButtonState.GAINED);
            this.logManager.updateExperienceStatus('success');

            // Get updated experience
            const { experience, formattedExperience } = await getGlobalExperience();
            this.appState.updateExperience(experience, formattedExperience);

            // Add this: Update the display
            this.updateExperienceDisplay(formattedExperience);

            // Start cooldown timer after successful experience gain
            this.cooldownTimer.startCooldown();

            // Reset to default state after delay
            setTimeout(() => {
                this.appState.updateExperienceButtonState(buttonId, ButtonState.DEFAULT);
            }, 3000);

        } catch (error: any) {
            console.error('Experience addition failed:', error);
            const readableError = parseShapeXpError(error);
            this.logManager.updateExperienceStatus('failed', readableError);

            // Reset to default state on error
            this.appState.updateExperienceButtonState(buttonId, ButtonState.DEFAULT);
        } finally {
            this.isProcessing = false; // Reset processing flag
            this.enableAllExperienceButtons(); // Re-enable all buttons
        }
    }

    private updateExperienceDisplay(amount: string) {
        const expElement = document.querySelector('.aux-mono.text-white li:first-child');
        if (expElement) {
            expElement.textContent = `shapexp: ${amount}`;
        }
    }
}
