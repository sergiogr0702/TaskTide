"use server";

import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { InputType, ReturnType } from './types';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";
import { createLog } from "@/lib/create-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    const user = await currentUser();

    if (!userId || !orgId || !user) {
        return {
            error: 'Unauthorized',
        };
    }

    const settingUrl = absoluteUrl(`/organization/${orgId}`);
    let url;

    try {
        const orgSubscription = await db.organizationSubscription.findUnique({
            where: {
                orgId: orgId,
            }
        });

        if (orgSubscription && orgSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: orgSubscription.stripeCustomerId,
                return_url: settingUrl,
            });

            url = stripeSession.url;
        } else {
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingUrl,
                cancel_url: settingUrl,
                payment_method_types: ['card'],
                mode: 'subscription',
                billing_address_collection: 'auto',
                customer_email: user.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: 'USD',
                            product_data: {
                                name: 'TaskTide Pro Version',
                                description: 'Unlimited boards for your organizacion'
                            },
                            unit_amount: 2000,
                            recurring: {
                                interval:'month'
                            },
                        },
                        quantity: 1,
                    }
                ],
                metadata: {
                    orgId
                },
            });

            url = stripeSession.url || '';
        }

    } catch (err) {
        return {
            error: 'And internal error has occurred',
        };
    }

    revalidatePath(`/organization/${orgId}`);
    return {
        data: url,
    };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);