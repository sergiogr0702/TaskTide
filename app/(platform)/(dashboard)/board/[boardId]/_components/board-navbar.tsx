import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
    data: Board;
}

export const BoardNavbar = async ({
    data
}: BoardNavbarProps) => {
    return (
        <div className="fixed top-14 flex items-center px-6 w-full gap-x-4 h-14 z-[40] text-slate-100 bg-black/50">
            <BoardTitleForm
                data={data}
            />
            <div className="ml-auto">
                <BoardOptions id={data.id} />
            </div>
        </div>
    );
}