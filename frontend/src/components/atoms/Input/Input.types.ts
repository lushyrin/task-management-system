export interface InputProps {
    label?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel';
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    helperText?: string;
    name?: string;
    id?: string;
    className?: string;
    showPasswordToggle?: boolean;
}

export interface CheckboxProps {
    label: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    name?: string;
    id?: string;
    className?: string;
}
