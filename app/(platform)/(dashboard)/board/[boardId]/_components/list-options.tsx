"use client";

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
    data: List;
    onAddCard: () => void;
}

export const ListOptions = ({
    data,
    onAddCard,
}: ListOptionsProps) => {
    const closePopoverRef = useRef<ElementRef<"button">>(null);
    const { execute: executeDelete } = useAction(deleteList, {
        onSuscess: (data) => {
            toast.success(`List ${data.title} deleted!`);
            closePopoverRef.current?.click();
        },
        onError: (error) => {
            toast.error(error);
        }
    });
    const { execute: executeCopy } = useAction(copyList, {
        onSuscess: (data) => {
            toast.success(`List ${data.title} copied!`);
            closePopoverRef.current?.click();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onDeleteList = (formData: FormData) => {
        const id = formData.get('id') as string;
        const boardId = formData.get('boardId') as string;

        executeDelete({
            id: id,
            boardId: boardId,
        });
    };

    const onCopyList = (formData: FormData) => {
        const id = formData.get('id') as string;
        const boardId = formData.get('boardId') as string;

        executeCopy({
            id: id,
            boardId: boardId,
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="size-auto p-2"
                >
                    <MoreHorizontal className="size-4"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                className="px-0 py-3"
            >
                <div className="pb-4 text-sm text-center font-medium text-neutral-600 ">
                    List actions
                </div>
                <PopoverClose ref={closePopoverRef} asChild>
                    <Button variant="ghost" className="size-auto p-2 absolute top-2 right-2 text-neutral-600">
                        <X className="size-4" />
                    </Button>
                </PopoverClose>
                <Button
                    variant="ghost"
                    className="rounded-none w-full p-2 px-5 justify-start h-auto font-normal text-sm"
                    onClick={onAddCard}
                >
                    Add card...
                </Button>
                <form
                    action={onCopyList}
                >
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormSubmit
                        className="rounded-none w-full p-2 px-5 justify-start h-auto font-normal text-sm"
                        variant="ghost"
                    >
                        Copy list...
                    </FormSubmit>
                </form>
                <Separator />
                <form
                    action={onDeleteList}
                >
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormSubmit
                        className="rounded-none w-full p-2 px-5 justify-start h-auto font-normal text-sm"
                        variant="ghost"
                    >
                        Delete this list...
                    </FormSubmit>
                </form>                
            </PopoverContent>
        </Popover>
    );
}