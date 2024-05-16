"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";


export const ProModal = () => {
    const proModal = useProModal(state => state);

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuscess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onClickSubscribe = () => {
        execute({});
    };

    return (
        <Dialog
            open={proModal.isOpen}
            onOpenChange={proModal.onClose}
        >
            <DialogContent
                className="p-0 max-w-md overflow-hidden"
            >
                <div className="flex items-center justify-center relative aspect-video">
                    <Image
                        src="/hero.svg"
                        alt="Hero"
                        fill
                    />
                </div>
                <div className="text-neutral-700 mx-auto p-6 space-y-6">
                    <h2 className="font-semibold text-xl">
                        Update to TaskTide Pro version now!
                    </h2>
                    <p className="text-xs font-semibold text-neutral-600">
                        Explore the best of TaskTide
                    </p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li>Unlimited boards</li>
                            <li>Advance checklist</li>
                            <li>Customizable board styles</li>
                            <li>Admin control and security</li>
                            <li>And more!</li>
                        </ul>
                    </div>
                    <Button
                        className="w-full"
                        variant="primary"
                        onClick={onClickSubscribe}
                        disabled={isLoading}
                    >
                        Upgrade
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};