export interface Phase {
    name: string;
    onBegin: () => void;
    onEnd: () => void;
}
