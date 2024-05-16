"use client";

import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { updateBoard } from "@/actions/update-board";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface BoardTitleFormProps {
    data: Board,
}

export const BoardTitleForm = ({
    data
}: BoardTitleFormProps) => {
    const { execute } = useAction(updateBoard, {
        onSuscess: (data) => {
            toast.success(`Board ${data.title} updated!`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
            disableEditing();
        }
    });

    const [ isEditing, setIsEditing ] = useState<Boolean>(false);
    const [ title, setTitle ] = useState<string>(data.title);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const disableEditing = () => {
        setIsEditing(false);
    };

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };

    const onSubmitForm = (formData: FormData) => {
        const title = formData.get('title') as string;

        execute({
            title: title,
            id: data.id,
        });
    };

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    if (isEditing) {
        return (
            <form
                ref={formRef}
                action={onSubmitForm}
                className="flex items-center gap-x-2"
            >
                <FormInput 
                    id="title"
                    defaultValue={title}
                    className="text-lg px-[7px] p-1 font-bold h-7 bg-transparent focus-visible:outline-none focus-visible:bg-transparent border-none"
                    ref={inputRef}
                    onBlur={onBlur}
                />
            </form>
        );
    }

    return (
        <Button
            variant="transparent"
            onClick={enableEditing}
            className="size-auto font-bold px-2 p-1 text-lg"
        >
            {title}
        </Button>
    );
};