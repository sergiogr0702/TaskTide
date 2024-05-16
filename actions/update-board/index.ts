"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";
import { createLog } from "@/lib/create-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const { title, id } = data;
    let board;

    try {
        board = await db.board.update({
            where: {
                id: id,
                orgId: orgId,
            },
            data: {
                title: title,
            },
        });

        await createLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.UPDATE,
        });

    } catch (error) {
        return {
            error: 'Error updating board',
        };
    }

    revalidatePath(`/board/${board.id}`);
    return {
        data: board,
    };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);