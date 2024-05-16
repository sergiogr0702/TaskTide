"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { OrgNavItem, Organization } from "./org-nav-item";


interface SidebarProps {
    storageKey?: string;
};

export const Sidebar = ({
    storageKey = 'tt-sidebar-state',
}: SidebarProps
) => {
    const [expanded, setExpanded] = useLocalStorage<Record<string,any>>(storageKey, {});
    const { organization: activeOrganization, isLoaded: isLoadedOrganization } = useOrganization();
    const { userMemberships, isLoaded: isLoadedOrganizationList } = useOrganizationList({userMemberships: { infinite: true }});

    const defaultAccordionValue: string[] = Object.keys(expanded)
        .reduce((acc: string[], key: string) =>{
            if (expanded[key]){
                acc.push(key);
            }

            return acc;
        }, []);

    const onExpand = (id: string) => {
        setExpanded((current) => ({
            ...current,
            [id]: !expanded[id],
        }));
    };

    if(!isLoadedOrganization || !isLoadedOrganizationList || userMemberships.isLoading) {
        return (
            <>
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-10 w-[50%]" />
                    <Skeleton className="size-10" />
                </div>
                <div className="space-y-2">
                        <OrgNavItem.Skeleton />
                        <OrgNavItem.Skeleton />
                        <OrgNavItem.Skeleton />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">
                    Workspaces
                </span>
                <Button
                    asChild
                    type='button'
                    size='icon'
                    className='ml-auto'
                    variant='ghost'
                >
                    <Link href='/org-select'>
                        <Plus className="size-4" />
                    </Link>
                </Button>
            </div>
            <Accordion
                type='multiple'
                defaultValue={defaultAccordionValue}
                className='space-y-2'
            >
                {
                    userMemberships.data.map(({ organization }) => (
                        <OrgNavItem 
                            key={organization.id}
                            isActive={activeOrganization?.id === organization.id}
                            isExpanded={expanded[organization.id]}
                            organization={organization as Organization}
                            onExpand={onExpand}
                        />
                    ))
                }
            </Accordion>
        </>
    );
};