"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { createLog } from "@/lib/create-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const { title, boardId, listId } = data;
    let card;

    try {
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId: orgId,
                },
            },
        });

        if (!list) {
            return {
                error: 'List not found',
            };
        }

        const lastCard = await db.card.findFirst({
            where: {
                listId: listId,
            },
            orderBy: {
                order: 'desc',
            },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data: {
                title: title,
                listId: listId,
                order: newOrder,
            },
        });

        await createLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        });

    } catch (error) {
        return {
            error: 'Error creating card',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: card,
    };
};

export const createCard= createSafeAction(CreateCard, handler);