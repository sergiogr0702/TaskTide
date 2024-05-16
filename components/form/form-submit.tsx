"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface FormSubmitProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
    disabled?: boolean;
};


export const FormSubmit = (
    {
        children,
        className,
        variant = "primary",
        disabled,
    }: FormSubmitProps
) => {
    const { pending } = useFormStatus();

    return (
        <Button
            className={cn(className)}
            variant={variant}
            size="sm"
            type="submit"
            disabled={ pending || disabled}
        >
            {children}
        </Button>
    );
};