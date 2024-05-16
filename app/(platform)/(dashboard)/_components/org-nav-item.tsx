"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
    Activity,
    CreditCard,
    Settings,
    Layout,
} from 'lucide-react';
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type Organization = {
    id: string;
    slug: string;
    imageUrl: string;
    name: string;
};

interface OrgNavItemProps {
    isActive: Boolean;
    isExpanded: Boolean;
    organization: Organization;
    onExpand: (id: string) => void;
}

export const OrgNavItem = ({
    isActive,
    isExpanded,
    organization,
    onExpand,
}: OrgNavItemProps
) => {
    const routes = [
        {
            label: 'Boards',
            icon: <Layout className="size-4 mr-2"/>,
            href: `/organization/${organization.id}`,
        },
        {
            label: 'Activity',
            icon: <Activity className="size-4 mr-2"/>,
            href: `/organization/${organization.id}/activity`,
        },
        {
            label: 'Settings',
            icon: <Settings className="size-4 mr-2"/>,
            href: `/organization/${organization.id}/settings`,
        },
        {
            label: 'Billing',
            icon: <CreditCard className="size-4 mr-2"/>,
            href: `/organization/${organization.id}/billing`,
        },
    ];

    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (href: string) => {
        router.push(href);
    }

    return (
        <AccordionItem
            value={organization.id}
            className="border-none"
        >
            <AccordionTrigger
                onClick={() => onExpand(organization.id)}
                className={cn(
                    'flex items-center p-1.5 gap-x-2 rounded-md text-neutral-700 transition text-start no-underline hover:bg-neutral-500/10 hover:no-underline',
                    isActive && !isExpanded && 'bg-sky-500/10 text-sky-700'
                )}
            >
                <div className="flex items-center gap-x-2">
                    <div className="size-7 relative">
                        <Image 
                            fill
                            src={organization.imageUrl}
                            alt={`${organization.name} image`}
                            className="rounded-sm object-cover"
                        />
                    </div>
                    <span className="font-medium text-sm">
                        {organization.name}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 text-neutral-700">
                {
                    routes.map((route) => (
                        <Button
                            key={route.href}
                            size="sm"
                            variant="ghost"
                            className={cn(
                                'w-full font-normal justify-start mb-1 pl-10',
                                pathname === route.href && 'bg-sky-500/10 text-sky-700'
                            )}
                            onClick={() => handleClick(route.href)}
                        >
                            {route.icon}
                            {route.label}
                        </Button>
                    ))
                }
            </AccordionContent>
        </AccordionItem>
    );
};

OrgNavItem.Skeleton = function SkeletonOrgNavItem() {
    return (
        <div className="flex items-center gap-x-2">
            <div className="size-10 relative shrink-0">
                <Skeleton  className="h-full w-full absolute"/>
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    );
};