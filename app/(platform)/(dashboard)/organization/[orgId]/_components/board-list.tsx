import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { db } from "@/lib/db";
import { getAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { HelpCircle, User2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";


export const BoardList = async() => {
    const { orgId } = auth();

    if (!orgId) {
        redirect('/org-select');
    }

    const boards = await db.board.findMany({
        where: { orgId: orgId },
        orderBy: { createdAt: 'desc'},
    });

    const availableCount = await getAvailableCount();
    const isPro = await checkSubscription();

    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="size-6 mr-2"/>
                My Boards
            </div>  
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {
                    boards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/board/${board.id}`}
                            style={{ backgroundImage: `url(${board.imageThumbUrl})`}}
                            className="rounded-sm size-full p-2 group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
                            <p className="relative font-semibold text-slate-100">
                                {board.title}
                            </p>
                        </Link>
                    ))
                }
                <FormPopover
                    side="right"
                    sideOffset={10}
                >
                    <div
                        className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col items-center justify-center gap-y-1 hover:opacity-75 transition"
                        role="button"
                    >
                        <p className="text-sm">
                            Create new board
                        </p>
                        <span className="text-xs">
                            {isPro ? 'Unlimited' : `${MAX_FREE_BOARDS - availableCount} remaining`}
                        </span>
                        <Hint
                            description={`
                                Free workspaces can have up to 5 opened boards. In order to have more boards, upgrade this workspace to a premium plan.
                            `}
                            sideOffset={40}
                        >
                            <HelpCircle className="absolute bottom-2 right-2 size-[14px]"/>
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    );
};


BoardList.Skeleton = function SkeletonBoardList() {
    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            <Skeleton 
                className="aspect-video size-full p-2"
            />
            <Skeleton 
                className="aspect-video size-full p-2"
            />
            <Skeleton 
                className="aspect-video size-full p-2"
            />
            <Skeleton 
                className="aspect-video size-full p-2"
            />
            <Skeleton 
                className="aspect-video size-full p-2"
            />
            <Skeleton 
                className="aspect-video size-full p-2"
            />
        </div>
    );
}