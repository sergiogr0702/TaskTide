"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
    index: number;
    data: Card;
}

export const CardItem = ({
    index,
    data
}: CardItemProps) => {
    const cardModal = useCardModal();

    return (
        <Draggable
            index={index}
            draggableId={data.id}
        >
            {
                (provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        role="button"
                        onClick={() => cardModal.onOpen(data.id)}
                        className="truncate border-2 border-transparent hover:border-black py-2 px-3 bg-white rounded-md text-sm shadow-sm"
                    >
                        {data.title}
                    </div>
                )
            }
        </Draggable>
    );
};