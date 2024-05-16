"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";
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
    let list;

    try {
        list = await db.list.delete({
            where: {
                id: id,
                boardId: boardId,
                board: {
                    orgId: orgId,
                },
            },
        });

        await createLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.DELETE,
        });

    } catch (error) {
        return {
            error: 'Error deleting list',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: list,
    };
};

export const deleteList = createSafeAction(DeleteList, handler);