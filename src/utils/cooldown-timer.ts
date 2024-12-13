// src/utils/cooldown-timer.ts
export class CooldownTimer {
    private static instance: CooldownTimer;
    private timerInterval: ReturnType<typeof setInterval> | null = null;
    private cooldownElement: HTMLElement | null = null;

    private constructor() {
        this.cooldownElement = document.getElementById('ShapeXpCooldown');
    }

    public static getInstance(): CooldownTimer {
        if (!CooldownTimer.instance) {
            CooldownTimer.instance = new CooldownTimer();
        }
        return CooldownTimer.instance;
    }

    public resetTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const cooldownElement = document.getElementById('ShapeXpCooldown');
        if (cooldownElement) {
            cooldownElement.textContent = 'xp cooldown: 0';
        }
    }

    public startCooldown() {
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Set initial time (30 minutes in seconds)
        let timeRemaining = 30 * 60;

        // Update immediately then start interval
        this.updateDisplay(timeRemaining);

        this.timerInterval = setInterval(() => {
            timeRemaining--;

            if (timeRemaining <= 0) {
                this.stopCooldown();
            } else {
                this.updateDisplay(timeRemaining);
            }
        }, 1000);
    }

    private stopCooldown() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Reset display
        if (this.cooldownElement) {
            this.cooldownElement.textContent = 'xp cooldown: 0';
        }
    }

    private updateDisplay(seconds: number) {
        if (!this.cooldownElement) return;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        this.cooldownElement.textContent = `xp cooldown: ${minutes}m ${remainingSeconds}s`;
    }
}
