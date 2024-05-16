"use client";

import { updateCard } from "@/actions/update-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface DescriptionProps {
    data: CardWithList,
};

export const Description = ({
    data,
}: DescriptionProps) => {
    const params = useParams();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const textAreaRef = useRef<ElementRef<"textarea">>(null);
    const formRef = useRef<ElementRef<"form">>(null);
    const { execute, fieldErrors } = useAction(updateCard, {
        onSuscess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['card', data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ['card-logs', data.id],
            });
            toast.success(`Card ${data.title} updated!`);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textAreaRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onSubmitForm = (formData: FormData) => {
        const description = formData.get('description') as string;
        const boardId = params.boardId as string;

        execute({
            id: data.id,
            boardId: boardId,
            description: description,
        });
    };

    return (
        <div className="flex items-start w-full gap-x-3">
            <AlignLeft
                className="size-6 text-neutral-700 mt-0.5"
            />
            <div className="w-full">
                <p className="mb-2 font-semibold text-neutral-700">
                    Description
                </p>
                {
                    isEditing 
                    ? (
                        <form 
                            ref={formRef}
                            action={onSubmitForm}
                            className="space-y-2"    
                        >
                            <FormTextarea
                                id="description"
                                placeholder="Add a detailed description for this task..."
                                ref={textAreaRef}
                                defaultValue={data.description || undefined}
                                className="w-full mt-2"
                                errors={fieldErrors}
                            />
                            <div className="flex items-center gap-x-2">
                                <FormSubmit>
                                    Save
                                </FormSubmit>
                                < Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={disableEditing}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )
                    : (
                        <div
                            role="button"
                            onClick={enableEditing}
                            className="text-sm font-medium px-3.5 py-3 min-h-[78px] bg-slate-100 rounded-md"
                        >
                            {
                                data.description || 'Add a detailed description for this task...'
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div
            className="flex items-start w-full gap-x-3"
        >
            <Skeleton
                className="size-6 bg-slate-200"
            />
            <div className="w-full">
                <Skeleton
                    className="mb-2 w-24 h-6 bg-slate-200"
                />
                <Skeleton
                    className="w-full h-[76px] bg-slate-200"
                />
            </div>
        </div>
    );
}