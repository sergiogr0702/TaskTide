"use client";

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
    data: CardWithList
};

export const Header = ({
    data,
}: HeaderProps) => {
    const params = useParams();
    const inputRef = useRef<ElementRef<"input">>(null);
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(data.title);
    const { execute } = useAction(updateCard, {
        onSuscess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['card', data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ['card-logs', data.id],
            });
            toast.success(`Card renamed to ${data.title}!`);
            setTitle(data.title);
        },
        onError: (error) => {
            toast.error(error);
        },
    });
    
    const onBlur = () => {
        inputRef.current?.form?.requestSubmit();
    };

    const onSubmitForm = (formData: FormData) => {
        const newTitle = formData.get('title') as string;
        const boardId = params.boardId as string;

        if (newTitle === data.title){
            return;
        }

        execute({
            title: newTitle,
            id: data.id,
            boardId: boardId,
        });
    };

    return (
        <div className="w-full flex items-start gap-x-3 mb-6">
            <Layout className="size-5 mt-1 text-neutral-700" />
            <div className="w-full">
                <form
                    action={onSubmitForm}
                >
                    <FormInput 
                        id='title'
                        ref={inputRef}
                        onBlur={onBlur}
                        defaultValue={title}
                        className="text-xl px-1 mb-0.5 text-neutral-700 w-[95%] relative -left-1.5 border-transparent bg-transparent font-semibold focus-visible:bg-white focus-visible:border-input truncate"
                    />
                </form>
                <p className="text-muted-foreground text-sm">
                    in list <span className="underline">{data.list.title}</span>
                </p>
            </div>
        </div>
    );
};

Header.Skeleton = function HeaderSkeleton() {
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton
                className="size-6 mt-1 text-neutral-700"
            />
            <div>
                <Skeleton
                    className="h-6 w-24 mb-1 bg-neutral-200"
                />
                <Skeleton
                    className="h-4 w-12 bg-neutral-200"
                />
            </div>
        </div>
    );
}