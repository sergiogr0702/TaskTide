"use client";

import { createCard } from "@/actions/create-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, KeyboardEventHandler, forwardRef, useRef } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
    listId: string;
    isEditing: boolean;
    enableEditing: () => void;
    disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
    listId,
    isEditing,
    enableEditing,
    disableEditing,
}, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);
    const { execute, fieldErrors } = useAction(createCard, {
        onSuscess: (data) => {
            toast.success(`Card ${data.title} created!`);
            formRef.current?.reset();
        },
        onError: (error) => {
            toast.error(error);
        },
    })

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            disableEditing();
        }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener('keydown', onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    const onFormSubmit = (formData: FormData) => {
        const title = formData.get('title') as string;
        const listId = formData.get('listId') as string;
        const boardId = params.boardId as string;

        execute({
            title: title,
            listId: listId,
            boardId: boardId,
        });
    };


    if (isEditing) {
        return (
            <form 
                action={onFormSubmit}
                ref={formRef}
                className="m-1 py-0.5 px-1 space-y-4"
            >
                <FormTextarea 
                    id="title"
                    ref={ref}
                    placeholder="Enter a title for this card..."
                    onKeyDown={onTextareaKeyDown}
                    errors={fieldErrors}
                    
                />
                <input
                    id="listId"
                    name="listId"
                    value={listId}
                    hidden  
                />
                <div className="flex items-center gap-x-1">
                    <FormSubmit>
                        Add card
                    </FormSubmit>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={disableEditing}
                    >
                        <X className="size-5"/>
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="px-2 pt-2">
            <Button
                className="h-auto px-2 py-1.5 w-full text-sm justify-start text-muted-foreground"
                onClick={enableEditing}
                size="sm"
                variant="ghost"
            >
                <Plus className="size-4 mr-2"/>
                Add a card
            </Button>
        </div>
    );
});

CardForm.displayName = 'CardForm';