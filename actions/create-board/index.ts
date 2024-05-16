"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createLog } from "@/lib/create-log";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        };
    }

    const canCreate = await hasAvailableCount();
    const isPro = await checkSubscription();

    if (!canCreate && !isPro) {
        return {
            error: 'You have reached the maximum number of boards for your organization. Please upgrade your plan to create more boards.',
        };
    }

    const { title, image } = data;
    let board;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
    ] = image.split('|');

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: 'Image missing fields. Failed to create board.',
        };
    }

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML,
            }
        });

        if (!isPro) {
            await incrementAvailableCount();
        }
        
        await createLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
        });

    } catch (error) {
        return {
            error: 'Error creating board',
        };
    }

    revalidatePath(`/board/${board.id}`);
    return {
        data: board,
    };
}

export const createBoard = createSafeAction(CreateBoard, handler)