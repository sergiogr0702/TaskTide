"use client";

import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface ListItemProps {
    data: ListWithCards;
    index: number;
}

export const ListItem = ({
    data,
    index
}: ListItemProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const textAreaRef = useRef<ElementRef<"textarea">>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textAreaRef.current?.focus();
            textAreaRef.current?.select();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    return (
        <Draggable
            index={index}
            draggableId={data.id}
        >
            {
                (provided) => (
                    <li
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="h-full shrink-0 select-none w-[270px]"
                    >
                        <div
                            {...provided.dragHandleProps}
                            className="w-full bg-[#f1f2f4] shadow-md pb-2 rounded-md"
                        >
                            <ListHeader 
                                data={data}
                                onAddCard={enableEditing}
                            />
                            <Droppable
                                droppableId={data.id}
                                type="card"
                            >
                                {
                                    (provided) => (
                                        <ol
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn(
                                                'flex flex-col gap-y-2 mx-1 px-1 py-0.5',
                                                data.cards.length > 0 ? 'mt-2' : 'mt-0',
                                            )}
                                        >
                                            {
                                                data.cards.map((card, index) => (
                                                    <CardItem
                                                        key={card.id}
                                                        index={index}    
                                                        data={card}
                                                    />
                                                ))
                                            }
                                            {provided.placeholder}
                                        </ol>
                                    )
                                }
                            </Droppable>
                            <CardForm
                                ref={textAreaRef}
                                isEditing={isEditing}
                                enableEditing={enableEditing}
                                disableEditing={disableEditing}
                                listId={data.id}
                            />
                        </div>
                    </li>
                )
            }
        </Draggable>
    );
};