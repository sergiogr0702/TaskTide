"use client";

import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";


interface FormPopoverProps {
    children: React.ReactNode;
    align?: "start" | "center" | "end";
    sideOffset?: number;
    side?: "top" | "bottom" | "left" | "right";
}

export const FormPopover = ({
    children,
    align,
    side = "bottom",
    sideOffset = 0,
}: FormPopoverProps) => {
    const proModal = useProModal(state => state);
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuscess: (data) => {
            toast.success('Board created!');
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            toast.error(error);
            proModal.onOpen();
        }
    });

    const onFormSubmit =  (formData: FormData) =>{
        const title = formData.get('title') as string;
        const image = formData.get('image') as string;

        execute({ title, image });
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
                align={align}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create board
                </div>
                <PopoverClose asChild ref={closeRef}>
                    <Button variant="ghost" className="size-auto p-2 absolute top-2 right-2 text-neutral-600">
                        <X className="size-4"/>
                    </Button>
                </PopoverClose>
                <form className="space-y-4" action={onFormSubmit}>
                    <div className="space-y-4">
                        <FormPicker
                            id="image"
                            errors={fieldErrors}
                        />
                        <FormInput
                            id="title"
                            label="Board title"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className="w-full">
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};