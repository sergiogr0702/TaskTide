import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "./db";

interface Props {
    entityId: string;
    entityTitle: string;
    entityType: ENTITY_TYPE;
    action: ACTION;
};

export const createLog = async ({
    entityId,
    entityTitle,
    entityType,
    action,
}: Props) => {
    try {
        const { orgId } = auth();
        const user = await currentUser();

        if (!user || !orgId) {
            throw new Error('User or organization not found');
        }

        await db.log.create({
            data: {
                action: action,
                entityId: entityId,
                entityTitle: entityTitle,
                entityType: entityType,
                orgId: orgId,
                userId: user.id,
                userImage: user?.imageUrl,
                username: user?.firstName + ' ' + user?.lastName,
            }
        });

    } catch (err) {
        console.log('[LOG_ERROR]: ', err);
    }
};