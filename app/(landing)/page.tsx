import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";
import Link from "next/link";
import localFont from 'next/font/local';
import { cn } from "@/lib/utils";
import { Playfair_Display } from "next/font/google";

const headingCustomFont = localFont({
    src: '../../public/fonts/cal-open-sans.woff2'
});

const textCustomFont = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900']
});

const LandingPage = () => {
    return (
        <div className="flex items-center justify-center flex-col">
            <div className={cn(
                "flex items-center justify-center flex-col",
                headingCustomFont.className,
                )}>
                <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
                    <Medal className="size-6 mr-2"/>
                    No 1 task management
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
                    TaskTide helps team move
                </h1>
                <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit">
                    work forward.
                </div>
            </div>
            <div className={cn(
                "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
                textCustomFont.className,
            )}>
                TaskTide unifies your tasks, teammates, and tools. Keep everything in the same place, even if your team is not. Simple, flexible and powerful. All you need are boards, lists and cards so you can clearly see who is doing what and what tasks are pending.
            </div>
            <Button className="mt-6" size="lg" asChild>
                <Link href="/sign-up">
                    Get started for free
                </Link>
            </Button>
        </div>
    );
};

export default LandingPage;