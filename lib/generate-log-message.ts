import { ACTION, Log } from "@prisma/client";

export const generateLogMessage = ({
    action,
    entityTitle,
    entityType,
}: Log) => {
    switch (action) {
        case ACTION.CREATE:
            return `created ${entityType.toLowerCase()} "${entityTitle}"`;
        case ACTION.UPDATE:
            return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
        case ACTION.DELETE:
            return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
        default:
            return 'unknown action';
    };
};