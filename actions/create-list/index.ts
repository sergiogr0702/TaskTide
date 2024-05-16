"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";
import { createLog } from "@/lib/create-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const { title, boardId } = data;
    let list;

    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId: orgId,
            },
        });

        if (!board) {
            return {
                error: 'Board not found',
            };
        }

        const lastList = await db.list.findFirst({
            where: {
                boardId: boardId,
            },
            orderBy: {
                order: 'desc',
            },
            select: {
                order: true,
            },
        });

        const newOrder = lastList ? lastList.order + 1 : 1;


        list = await db.list.create({
            data: {
                title: title,
                boardId: boardId,
                order: newOrder,
            },
        });

        await createLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE,
        });

    } catch (error) {
        return {
            error: 'Error creating list',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: list,
    };
};

export const createList = createSafeAction(CreateList, handler);