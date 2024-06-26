"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
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
        card = await db.card.delete({
            where: {
                id: id,
                list: {
                    board: {
                        orgId: orgId,
                    },
                },
            },
        });

        await createLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE,
        });

    } catch (error) {
        return {
            error: 'Error deleting card',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: card,
    };
};

export const deleteCard = createSafeAction(DeleteCard, handler);