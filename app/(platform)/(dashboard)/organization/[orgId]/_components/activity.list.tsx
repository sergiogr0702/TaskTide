import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const ActivityList = async () => {
    const { orgId } = auth();

    if (!orgId) {
        redirect('/org-select');
    }

    const logs = await db.log.findMany({
        where:{
            orgId: orgId,
        },
        orderBy: { 
            createdAt: 'desc' 
        },
    });

    return (
        <ol className="mt-4 space-y-4">
            <p className="hidden text-xs text-muted-foreground text-center last:block">
                No activities found for this organization
            </p>
            {
                logs.map(log => (
                    <ActivityItem
                        key={log.id}
                        data={log}
                    />
                ))
            }
        </ol>
    );
};

ActivityList.Skeleton = function ActivityListSkeleton () {
    return (
        <ol className="mt-4 space-y-4">
            <Skeleton
                className="w-[80%] h-14"
            />
            <Skeleton
                className="w-[50%] h-14"
            />
            <Skeleton
                className="w-[60%] h-14"
            />
            <Skeleton
                className="w-[70%] h-14"
            />
            <Skeleton
                className="w-[80%] h-14"
            />
            <Skeleton
                className="w-[75%] h-14"
            />
        </ol>
    );
}