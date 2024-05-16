"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const ListContainer = ({
    data,
    boardId
}: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);
    const { execute: executeReorderList } = useAction(updateListOrder, {
        onSuscess: () => {
            toast.success(`List reordered!`);
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const { execute: executeReorderCard } = useAction(updateCardOrder, {
        onSuscess: () => {
            toast.success(`Card reordered!`);
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return;
        }

        if (type === 'list') {
            const items = reorder(orderedData, source.index, destination.index).map((item, index) => ({ ...item, order: index }));
            setOrderedData(items);
            executeReorderList({ items: items, boardId: boardId });
        }

        if (type === 'card') {
            let newOrderedData = [...orderedData];
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destinationList = newOrderedData.find(list => list.id === destination.droppableId);

            if (!sourceList || !destinationList) {
                return;
            }

            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            if (!destinationList.cards) {
                destinationList.cards = [];
            }

            if (source.droppableId === destination.droppableId) {
                const newCards = reorder(sourceList.cards, source.index, destination.index);
                newCards.forEach((card, index) => {
                    card.order = index;
                })
                sourceList.cards = newCards;
                setOrderedData(newOrderedData);
                executeReorderCard({ items: newCards, boardId: boardId });
            } else {
                const [draggedCard] = sourceList.cards.splice(source.index, 1);
                draggedCard.listId = destination.droppableId;
                destinationList.cards.splice(destination.index, 0, draggedCard);
                sourceList.cards.forEach((card, index) => {
                    card.order = index;
                });
                destinationList.cards.forEach((card, index) => {
                    card.order = index;
                });
                setOrderedData(newOrderedData);
                executeReorderCard({ items: destinationList.cards, boardId: boardId });
            }
        }
    };

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            <Droppable
                droppableId="lists"
                type="list"
                direction="horizontal"
            >
                {
                    (provided) => (
                        <ol
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex gap-x-3 h-full"    
                        >
                            {
                                orderedData.map((list, index) => (
                                    <ListItem
                                        key={list.id}
                                        index={index}
                                        data={list}
                                    />
                                ))
                            }
                            {provided.placeholder}
                            <ListForm />
                            <div className="flex-shrink-0 w-1"/>
                        </ol>
                    )
                }
            </Droppable>
        </DragDropContext>
    );
};