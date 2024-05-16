"use client";

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
    data: List;
    onAddCard: () => void;
}

export const ListHeader = ({data, onAddCard}:ListHeaderProps) => {
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [ isEditing, setIsEditing ] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>(data.title);
    const { execute } = useAction(updateList, {
        onSuscess: (data) => {
            toast.success(`List renamed to ${data.title}!`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
            disableEditing();
        }
    });

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

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            formRef.current?.requestSubmit();
        }
    };

    useEventListener("keydown", onKeyDown);

    const onSubmitForm = (formData: FormData) => {
        const title = formData.get('title') as string;
        const id = formData.get('id') as string;
        const boardId = formData.get('boardId') as string;

        if (title === data.title){
            disableEditing();
        } else {
            execute({
                title: title,
                id: id,
                boardId: boardId,
            });
        }
    };

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {
                isEditing ? (
                    <form
                        className="flex-1 px-[2px]"
                        ref={formRef}
                        action={onSubmitForm}
                    >
                        <input hidden id="id" name="id" value={data.id} />
                        <input hidden id="boardId" name="boardId" value={data.boardId} />
                        <FormInput
                            id="title"
                            ref={inputRef}
                            placeholder="Enter list title..."
                            defaultValue={title}
                            className="text-sm px-[7px] bg-transparent py-1 h-7 border-transparent transition truncate font-medium hover:border-input focus:border-input focus:bg-slate-100"
                            onBlur={onBlur}
                        />
                        <button hidden type="submit" />
                    </form>
                ) : (
                    <div
                        onClick={enableEditing}
                        className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
                    >
                        {title}
                    </div>
                )
            }
            <ListOptions 
                data={data}
                onAddCard={onAddCard}
            />
        </div>
    );
}