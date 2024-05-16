import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
};

const BoardIdPage = async ({
    params
}: BoardIdPageProps) => {
    const { orgId } = auth();

    if (!orgId) {
        redirect('org-select');
    }

    const lists = await db.list.findMany({
        where: {
            boardId: params.boardId,
            board: {
                orgId: orgId,
            },
        },
        include: {
            cards: {
                orderBy: {
                    order: 'asc',
                },
            },
        },
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer
                data={lists}
                boardId={params.boardId}
            />
        </div>
    );
}

export default BoardIdPage;