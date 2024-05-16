import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({ params }: { params: { boardId: string }}) {
    const { orgId } = auth();

    if (!orgId) {
       return {
            title: 'Board',
       };
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId: orgId,
        },
    });

    if (!board) {
        return {
            title: 'Board',
       };
    }

    return {
        title: board.title,
   };
}

const BoardIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        boardId: string;
    };
}) => {
    const { orgId } = auth();

    if (!orgId) {
        redirect('/org-select');
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId: orgId,
        },
    });

    if (!board) {
        notFound();
    }

    return (
        <div
            style={{ backgroundImage: `url(${board.imageFullUrl})`}}
            className="relative h-full bg-center bg-no-repeat bg-cover"
        >
            <BoardNavbar data={board} />
            <div className="absolute inset-0 bg-black/20"/>
            <main className="relative h-full pt-28">
                {children}
            </main>
        </div>
    );
};

export default BoardIdLayout;