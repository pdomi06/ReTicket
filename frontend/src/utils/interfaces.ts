export interface ISceneryMap {
    name: string;
    width: number;
    height: number;
    rate: number;
}

export interface InputProps {
    type?: string;
    label: string;
    name: string;
    value?: string | number;
    step?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextareaProps {
    label: string;
    name: string;
    value?: string;
    rows?: number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}