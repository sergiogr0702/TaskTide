"use client";

import { deleteBoard } from "@/actions/delete-board";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

interface BoardOptionsProps {
    id: string;
}

export const BoardOptions = ({
    id
}: BoardOptionsProps) => {
    const { execute, isLoading } = useAction(deleteBoard, {
        onError: (error) => {
            toast.error(error);
        },
    });

    const onDeleteBoard = () => {
        execute({ id });
    }
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="transparent"
                    className="size-auto p-2"
                >
                    <MoreHorizontal
                        className="size-4"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                className="px-0 py-3"
            >
                <div
                    className="text-center font-medium text-neutral-600 pb-4"
                >
                    Board actions
                </div>
                <PopoverClose asChild>
                    <Button
                        variant="ghost"
                        className="size-auto p-2 absolute top-2 right-2 text-neutral-600"
                    >
                        <X className="size-4"/>
                    </Button>
                </PopoverClose>
                <Button
                    className="rounded-none h-auto w-full p-2 px-5 justify-start text-sm font-normal"
                    variant="ghost"
                    onClick={onDeleteBoard}
                    disabled={isLoading}
                >
                    Delete this board
                </Button>
            </PopoverContent>
        </Popover>
    );
}