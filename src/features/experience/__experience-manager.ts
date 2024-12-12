import { ExperienceButtonState, ExperienceAmount } from '../../types/button-states';
import { addGlobalExperience } from './experience-addition';
import { getGlobalExperience } from './experience-tracking';
import { LogManager } from '../../utils/log-manager';
import { AppState } from '../../state/state-store';

export class ExperienceManager {
    private appState: AppState;
    private isProcessing: { [key: string]: boolean } = {};
    private logManager: LogManager;

    private readonly experienceButtons = {
        low: 'ShapeXpSandboxXpLow',
        mid: 'ShapeXpSandboxXpMid',
        high: 'ShapeXpSandboxXpHigh'
    };

    constructor() {
        this.logManager = LogManager.getInstance();
        this.appState = AppState.getInstance();

        Object.values(this.experienceButtons).forEach(id => {
            this.isProcessing[id] = false;
        });

        this.initializeExperienceButtons();

    }

    private initializeExperienceButtons() {
        Object.entries(this.experienceButtons).forEach(([level, buttonId]) => {
            const button = document.getElementById(buttonId);
            if (!button) return;

            button.addEventListener('click', async () => {
                if (this.isProcessing[buttonId]) {
                    console.log('Experience gain already in progress');
                    return;
                }

                const expType = ExperienceAmount[level.toUpperCase() as keyof typeof ExperienceAmount];
                await this.handleExperienceAdd(buttonId, expType);
            });
        });
    }

    private async handleExperienceAdd(buttonId: string, expType: ExperienceAmount) {
        if (this.isProcessing[buttonId]) return;

        try {
            this.isProcessing[buttonId] = true;
            // CHANGE: Update to use new state management
            this.appState.updateExperienceButtonState(buttonId, ExperienceButtonState.GAINING);
            this.logManager.updateExperienceStatus('start');

            await addGlobalExperience(expType);

            // Show success state
            this.appState.updateExperienceButtonState(buttonId, ExperienceButtonState.GAINED);
            this.logManager.updateExperienceStatus('success');

            // Reset state after delay
            setTimeout(() => {
                this.appState.updateExperienceButtonState(buttonId, ExperienceButtonState.DEFAULT);
            }, 3000);

            // Update experience display if needed
            const { experience, formattedExperience } = await getGlobalExperience();
            this.appState.updateExperience(experience, formattedExperience);

        } catch (error: any) {
            console.error('Experience addition failed:', error);
            this.logManager.updateExperienceStatus('failed', error.message);
            this.appState.updateExperienceButtonState(buttonId, ExperienceButtonState.DEFAULT);
        } finally {
            this.isProcessing[buttonId] = false;
        }
    }
    //private async handleExperienceAdd(expType: ExperienceAmount) {
    //    if (this.isProcessing) {
    //        console.log('Experience addition already in progress');
    //        return;
    //    }

    //    try {
    //        this.isProcessing = true;
    //        this.updateButtonStates(true);
    //        this.logManager.updateExperienceStatus('start');

    //        // Add experience
    //        await addGlobalExperience(expType);

    //        // Update experience display after successful addition
    //        const { experience, formattedExperience } = await getGlobalExperience();
    //        this.appState.updateExperience(experience, formattedExperience);

    //        this.logManager.updateExperienceStatus('success');

    //    } catch (error: any) {
    //        console.error('Experience addition failed:', error);
    //        this.logManager.updateExperienceStatus('failed', error.message);

    //    } finally {
    //        this.isProcessing = false;
    //        this.updateButtonStates(false);
    //    }
    //}

    private setupExperienceButtons() {
        // Set up each experience button
        Object.entries(this.experienceButtons).forEach(([level, buttonId]) => {
            const button = document.getElementById(buttonId);
            if (!button) return;

            button.addEventListener('click', async () => {
                if (this.isProcessing[buttonId]) {
                    console.log('Experience gain already in progress');
                    return;
                }

                try {
                    await this.handleExperienceGain(
                        buttonId,
                        level as 'low' | 'mid' | 'high'
                    );
                } catch (error) {
                    console.error('Error gaining experience:', error);
                    this.appState.updateExperienceButtonState(buttonId, ExperienceButtonState.DEFAULT);
                }
            });
        });
    }

    private async handleExperienceGain(buttonId: string, level: 'low' | 'mid' | 'high') {
        this.isProcessing[buttonId] = true;
        this.appState.updateExperienceButtonState(buttonId, ExperienceButtonState.GAINING);

        try {
            const expType = ExperienceAmount[level.toUpperCase() as keyof typeof ExperienceAmount];
            await addGlobalExperience(expType);

            // Show success state
            this.appState.updateExperienceButtonState(buttonId, ExperienceButtonState.GAINED);

            // Reset to default state after 3 seconds
            setTimeout(() => {
                this.appState.updateExperienceButtonState(buttonId, ExperienceButtonState.DEFAULT);
            }, 3000);

        } catch (error: any) {
            console.error('Experience gain error:', error);
            throw error;
        } finally {
            this.isProcessing[buttonId] = false;
        }
    }

    private updateButtonStates(disabled: boolean) {
        const buttons = [
            'ShapeXpWorldAbtn',
            'ShapeXpWorldBbtn',
            'ShapeXpWorldCbtn'
        ];

        buttons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                if (disabled) {
                    button.setAttribute('disabled', 'true');
                } else {
                    button.removeAttribute('disabled');
                }
            }
        });
    }
}
