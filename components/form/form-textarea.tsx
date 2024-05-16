"use client";

import { KeyboardEventHandler, forwardRef } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement | undefined>;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
    id,
    label,
    placeholder,
    defaultValue,
    required,
    disabled,
    errors,
    className,
    onBlur,
    onClick,
    onKeyDown,
}, ref) => {
    const { pending } = useFormStatus();

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1">
                {
                    label ? (
                        <Label
                            htmlFor={id}
                            className="text-xs font-semibold text-neutral-700"
                        >
                            {label}
                        </Label>
                    ) : null
                }
                <Textarea 
                    id={id}
                    name={id}
                    ref={ref}
                    required={required}
                    placeholder={placeholder}
                    disabled={pending || disabled}
                    defaultValue={defaultValue}
                    onClick={onClick}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    className={cn(
                        'resize-none shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                        className
                    )}
                    aria-describedby={`${id}-error`}
                />
            </div>
            <FormErrors 
                id={id}
                errors={errors}
            />
        </div>
    );
});

FormTextarea.displayName = 'FormTextarea';