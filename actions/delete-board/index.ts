"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createLog } from "@/lib/create-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { decreaseAvailableCount } from "@/lib/org-limit";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const { id } = data;
    let board;

    try {
        board = await db.board.delete({
            where: {
                id: id,
                orgId: orgId,
            },
        });

        await decreaseAvailableCount();

        await createLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE,
        });

    } catch (error) {
        return {
            error: 'Error deleting board',
        };
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);