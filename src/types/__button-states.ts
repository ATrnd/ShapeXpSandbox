import { ButtonState } from '../types/button-states';
import { ButtonClasses } from './button-classes';

export enum ButtonState {
    DEFAULT = 'default',
    PROGRESS = 'progress',
    COMPLETED = 'completed'
}

export enum MintButtonState {
    DEFAULT = 'default',
    MINTING = 'minting',
    MINTED = 'minted'
}

export enum ExperienceButtonState {
    DEFAULT = 'default',
    GAINING = 'gaining',
    GAINED = 'gained'
}

export enum ExperienceAmount {
    LOW,
    MID,
    HIGH
}
