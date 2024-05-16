"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { Log } from "@prisma/client";
import { Activity } from "./activity";

export const CardModal = () => {
    const {id, isOpen, onClose} = useCardModal(state => state);
    const { data: cardData} = useQuery<CardWithList>({
        queryKey: ['card', id],
        queryFn: async () => fetcher(`/api/cards/${id}`),
    });

    const { data: logsData} = useQuery<Log[]>({
        queryKey: ['card-logs', id],
        queryFn: async () => fetcher(`/api/cards/${id}/logs`),
    });
    
    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                {
                    !cardData 
                        ? <Header.Skeleton />
                        : <Header data={cardData}/>
                }

                <div
                    className="grid grid-cols-1 md:grid-cols-4 md:gap-4"
                >
                    <div className="col-span-3">
                        <div className="space-y-6 w-full">
                            {
                                !cardData 
                                ? <Description.Skeleton />
                                : <Description data={cardData}/>
                            }
                            {
                                !logsData 
                                ? <Activity.Skeleton />
                                : <Activity items={logsData}/>
                            }
                        </div>
                    </div>
                    {
                        !cardData 
                        ? <Actions.Skeleton />
                        : <Actions data={cardData}/>
                    }
                </div>
            </DialogContent>
        </Dialog>
    );
};