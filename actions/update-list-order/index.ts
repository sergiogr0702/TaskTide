"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const { items, boardId } = data;
    let lists;

    try {
        const transaction = items.map((list) =>
            db.list.update({
                where: {
                    id: list.id,
                    board: {
                        orgId: orgId,
                    },
                },
                data: {
                    order: list.order,
                },
            })
        );

        lists = await db.$transaction(transaction);

    } catch (error) {
        return {
            error: 'Error updating order of lists',
        };
    }

    revalidatePath(`/board/${boardId}`);
    return {
        data: lists,
    };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);