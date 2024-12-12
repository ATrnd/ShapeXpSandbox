import { ButtonState, ExperienceAmount } from '../../types/button-states';
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
            this.appState.updateExperienceButtonState(buttonId, ButtonState.GAINING);
            this.logManager.updateExperienceStatus('start');

            await addGlobalExperience(expType);

            this.appState.updateExperienceButtonState(buttonId, ButtonState.GAINED);
            this.logManager.updateExperienceStatus('success');

            setTimeout(() => {
                this.appState.updateExperienceButtonState(buttonId, ButtonState.DEFAULT);
            }, 3000);

            const { experience, formattedExperience } = await getGlobalExperience();
            this.appState.updateExperience(experience, formattedExperience);

        } catch (error: any) {
            console.error('Experience addition failed:', error);
            this.logManager.updateExperienceStatus('failed', error.message);
            this.appState.updateExperienceButtonState(buttonId, ButtonState.DEFAULT);
        } finally {
            this.isProcessing[buttonId] = false;
        }
    }
}
