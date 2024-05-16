"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
    data: CardWithList,
};

export const Actions = ({
    data,
}: ActionsProps) => {
    const params = useParams();
    const cardModal = useCardModal();
    const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(copyCard, {
        onSuscess: (data) => {
            toast.success(`Card ${data.title} copied!`);
            cardModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        },
    });
    const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(deleteCard, {
        onSuscess: (data) => {
            toast.success(`Card ${data.title} deleted!`);
            cardModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onCopyCard = () => {
        const boardId = params.boardId as string;
        executeCopy({
            id: data.id,
            boardId: boardId,
        });
    };

    const onDeleteCard = () => {
        const boardId = params.boardId as string;
        executeDelete({
            id: data.id,
            boardId: boardId,
        });
    };

    return(
        <div className="mt-2 space-y-2">
            <p className="text-xs font-semibold">
                Actions
            </p>
            <Button
                variant="gray"
                size="inline"
                className="justify-start w-full"
                onClick={onCopyCard}
                disabled={isLoadingCopy}
            >
                <Copy className="size-4 mr-2" />
                Copy
            </Button>
            <Button
                variant="gray"
                size="inline"
                className="justify-start w-full"
                onClick={onDeleteCard}
                disabled={isLoadingDelete}
            >
                <Trash className="size-4 mr-2" />
                Delete
            </Button>
        </div>
    );
};

Actions.Skeleton = function ActionsSkeleton () {
    return (
        <div className="mt-2 space-y-2">
            <Skeleton
                className="w-20 h-4 bg-slate-100"
            />
            <Skeleton
                className="w-full h-8 bg-slate-100"
            />
            <Skeleton
                className="w-full h-8 bg-slate-100"
            />
        </div>
    );
};