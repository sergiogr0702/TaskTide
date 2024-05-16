"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createLog } from "@/lib/create-log";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const { title, id, boardId } = data;
    let list;

    try {
        list = await db.list.update({
            where: {
                id: id,
                boardId: boardId,
                board: {
                    orgId: orgId,
                },
            },
            data: {
                title: title,
            },
        });

        await createLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.UPDATE,
        });

    } catch (error) {
        return {
            error: 'Error updating list',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: list,
    };
};

export const updateList = createSafeAction(UpdateList, handler);