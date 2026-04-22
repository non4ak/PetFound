import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "toggle" | "dangerExtra";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    fullWidth?: boolean;
    isActive?: boolean;
    isLoading?: boolean;
    size?: ButtonSize;
    variant?: ButtonVariant;
}

const baseClassName =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const sizeClassNames: Record<ButtonSize, string> = {
    md: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
};

const variantClassNames: Record<ButtonVariant, string> = {
    danger: "border border-red-200 bg-white text-gray-500 hover:text-red-500 hover:border-red-300 focus:ring-red-500",
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    toggle: "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent focus:ring-blue-500",
    dangerExtra: "border border-red-200 bg-red-500 text-gray-100 hover:text-gray-100 hover:border-red-300 focus:ring-red-500",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
    const {
        children,
        className,
        disabled,
        fullWidth,
        isActive,
        isLoading,
        size,
        type,
        variant,
        ...restProps
  ***REMOVED*** = props;

    const resolvedVariant: ButtonVariant = variant ?? "primary";
    const resolvedSize: ButtonSize = size ?? "md";
    const isDisabled: boolean = disabled === true || isLoading === true;

    if (resolvedVariant === "toggle") {
        const toggleClassName = cn(
            baseClassName,
            variantClassNames.toggle,
            isActive === true ? "bg-blue-600" : "bg-gray-200",
            className,
        );

        return (
            <button
                {...restProps}
                ref={ref}
                aria-pressed={isActive}
                className={toggleClassName}
                disabled={isDisabled}
                type={type ?? "button"}
            >
                <span
                    className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        isActive === true ? "translate-x-5" : "translate-x-0",
                    )}
                />
                <span className="sr-only">{children}</span>
            </button>
        );
  ***REMOVED***

    const buttonClassName = cn(
        baseClassName,
        sizeClassNames[resolvedSize],
        variantClassNames[resolvedVariant],
        fullWidth === true ? "w-full" : "",
        className,
    );

    return (
        <button
            {...restProps}
            ref={ref}
            className={buttonClassName}
            disabled={isDisabled}
            type={type ?? "button"}
        >
            {isLoading === true ? (
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
});
