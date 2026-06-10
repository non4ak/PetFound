import { useState, type InputHTMLAttributes } from "react";

import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "label" | "type"> {
    error?: string;
    helperText?: string;
    label: string;
}

function EyeOpenIcon() {
    return (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
                d="M2 12C3.8 7.8 7.4 5 12 5s8.2 2.8 10 7c-1.8 4.2-5.4 7-10 7S3.8 16.2 2 12Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function EyeClosedIcon() {
    return (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
                d="M3 3l18 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
            <path
                d="M10.6 10.7a3 3 0 0 0 4.1 4.1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
            <path
                d="M6.7 6.8A12.8 12.8 0 0 0 2 12c1.8 4.2 5.4 7 10 7 1.9 0 3.6-.5 5.1-1.3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
            <path
                d="M9 5.4A11 11 0 0 1 12 5c4.6 0 8.2 2.8 10 7a13 13 0 0 1-2.8 4.2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

export function PasswordInput(props: PasswordInputProps) {
    const { autoComplete, error, helperText, label, placeholder, ...restProps } = props;
    const [isVisible, setIsVisible] = useState<boolean>(false);

    return (
        <TextInput
            {...restProps}
            autoComplete={autoComplete}
            endAdornment={
                <Button
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    className="h-8 w-8 rounded-full px-0 py-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        setIsVisible((currentValue) => !currentValue);
                    }}
                >
                    {isVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </Button>
            }
            error={error}
            helperText={helperText}
            label={label}
            placeholder={placeholder}
            type={isVisible ? "text" : "password"}
        />
    );
}
