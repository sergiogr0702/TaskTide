"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
import { createLog } from "@/lib/create-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const { id, boardId } = data;
    let card;

    try {
        const copyCard = await db.card.findUnique({
            where: {
                id: id,
                list: {
                    board: {
                        orgId: orgId,
                    },
                },
            },
        });

        if (!copyCard) {
            return {
                error: 'Card not found',
            };
        }

        const lastCard = await db.card.findFirst({
            where: {
                listId: copyCard.listId,
            },
            orderBy: {
                order: 'desc',
            },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data: {
                title: `${copyCard.title} - copy`,
                description: copyCard.description,
                listId: copyCard.listId,
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
            error: 'Error copying card',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: card,
    };
};

export const copyCard = createSafeAction(CopyCard, handler);