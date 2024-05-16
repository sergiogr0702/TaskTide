"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "sonner";

interface SubscriptionButtonProps {
    isPro: boolean;
};

export const SubscriptionButton = ({
    isPro,
}: SubscriptionButtonProps) => {
    const proModal = useProModal();
    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuscess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        }
    })

    const onClickSubscribe = () => {
        if (isPro) {
            execute({});
        } else {
            proModal.onOpen();
        }
    };

    return (
        <Button
            variant="primary"
            disabled={isLoading}
            onClick={onClickSubscribe}
        >
            {
                isPro
                   ? "Manage Subscription"
                    : "Upgrade to Pro"
            }
        </Button>
    );
};