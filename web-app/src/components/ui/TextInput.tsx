import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

type TextInputVariant = "default" | "error";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    endAdornment?: ReactNode;
    error?: string;
    helperText?: string;
    label: string;
    variant?: TextInputVariant;
}

const variantClassNames: Record<TextInputVariant, string> = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
    const { className, endAdornment, error, helperText, label, variant, ...restProps } = props;

    const resolvedVariant: TextInputVariant = error !== undefined && error.length > 0 ? "error" : (variant ?? "default");
    const helperClassName = error !== undefined && error.length > 0 ? "text-red-500" : "text-gray-500";

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    {...restProps}
                    ref={ref}
                    className={cn(
                        "w-full rounded-lg border px-4 py-2 outline-none transition-colors focus:ring-2",
                        endAdornment !== undefined ? "pr-12" : "",
                        variantClassNames[resolvedVariant],
                        className,
                    )}
                />
                {endAdornment !== undefined ? (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {endAdornment}
                    </div>
                ) : null}
            </div>
            {error !== undefined && error.length > 0 ? (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            ) : null}
            {helperText !== undefined && helperText.length > 0 ? (
                <p className={cn("mt-1 text-xs", helperClassName)}>{helperText}</p>
            ) : null}
        </div>
    );
});
