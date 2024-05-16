"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createLog } from "@/lib/create-log";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const { id, boardId, ...values } = data;
    let card;

    try {
        card = await db.card.update({
            where: {
                id: id,
                list: {
                    board: {
                        orgId: orgId,
                    },
                },
            },
            data: {
                ...values
            },
        });

        await createLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE,
        });

    } catch (error) {
        return {
            error: 'Error updating card',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: card,
    };
};

export const updateCard = createSafeAction(UpdateCard, handler);