"use client";

import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Log } from "@prisma/client";
import { ActivityIcon } from "lucide-react";

interface ActivityProps {
    items: Log[];
}

export const Activity = ({
    items,
}: ActivityProps) => {

    return (
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon
                className="size-5 mt-0.5 text-neutral-700"
            />
            <div className="w-full">
                <p className="mb-2 text-neutral-700 font-semibold">
                    Activity
                </p>
                <ol className="mt-2 space-y-4">
                    {
                        items.map(item => (
                            <ActivityItem
                                key={item.id}
                                data={item}
                            />
                        ))
                    }
                </ol>
            </div>
        </div>
    );
};

Activity.Skeleton = function ActivitySkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton
                className="size-6 bg-slate-200"
            />
            <div className="w-full ">
                <Skeleton
                    className="w-24 h-6 bg-slate-200 mb-2"
                />
                <Skeleton
                    className="w-full h-10 bg-slate-200"
                />
            </div>
        </div>
    );
};