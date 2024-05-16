"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";
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
        const copyList = await db.list.findUnique({
            where: {
                id: id,
                boardId: boardId,
                board: {
                    orgId: orgId,
                },
            },
            include: {
                cards: true,
            },
        });

        if (!copyList) {
            return {
                error: 'List not found',
            };
        }

        const lastList = await db.list.findFirst({
            where: {
                boardId: boardId,
            },
            orderBy: {
                order: 'desc',
            },
            select: { order: true },
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
            data: {
                title: `${copyList.title} - copy`,
                boardId: boardId,
                order: newOrder,
                cards: {
                    createMany: {
                        data: copyList.cards.map((card) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order,
                        })),
                    },
                },
            },
            include: {
                cards: true,
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
            error: 'Error copying list',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: list,
    };
};

export const copyList = createSafeAction(CopyList, handler);