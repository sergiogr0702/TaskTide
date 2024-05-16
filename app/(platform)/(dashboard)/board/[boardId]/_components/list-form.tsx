"use client";

import { Button } from "@/components/ui/button";
import { ListWrapper } from "./list-wrapper";
import { Plus, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

export const ListForm = () => {
    const router = useRouter();
    const params = useParams();
    const [isEditing, setIsEditing] = useState<Boolean>(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const { execute, fieldErrors } = useAction(createList, {
        onSuscess: (data) => {
            toast.success(`List ${data.title} created!`);
            disableEditing();
            router.refresh();
        },
        onError: (error) => {
            toast.error(error);
            disableEditing();
        }
    });

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            disableEditing();
        }
    };

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
        const boardId = formData.get('boardId') as string;

        execute({
            title: title,
            boardId: boardId,
        });
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    action={onSubmitForm}
                    ref={formRef}
                    className="w-full p-3 rounded-md space-y-4 shadow-md bg-slate-100"
                >
                    <FormInput
                        id="title"
                        placeholder="Enter list title..."
                        className="px-2 py-1 h-7 font-medium border-transparent text-sm hover:border-input focus:border-input transition"
                        ref={inputRef}
                        errors={fieldErrors}
                    />
                    <input hidden name="boardId" value={params.boardId}/>
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>
                            Add list
                        </FormSubmit>
                        <Button size="sm" variant="ghost" onClick={disableEditing}>
                            <X className="size-5"/>
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        );
    }

    return (
        <ListWrapper>
            <Button
                className="w-full rounded-md bg-slate-100/80 hover:bg-slate-100/50 flex items-center p-3 transition font-medium text-sm"
                onClick={enableEditing}
            >
                <Plus className="mr-2 size-4"/>
                Add a list
            </Button>
        </ListWrapper>
    );
}