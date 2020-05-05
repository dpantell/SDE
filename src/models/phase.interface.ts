import { PhaseStyle } from './phase-style.enum';

export interface Phase {
    name: string;
    style?: PhaseStyle;
    onBegin: () => void;
    onEnd: () => void;
}
