"use client";

import { useState, useEffect } from "react";
import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { defaultImages } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
};

export const FormPicker = ({
    id,
    errors,
}: FormPickerProps) => {
    const { pending } = useFormStatus();

    const [ images, setImages ] = useState<Array<Record<string, any>>>(defaultImages);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ selectedImageID, setSelectedImageID ] = useState(null);

    useEffect(() => {
        const imagesFetch = async () => {
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ['317099'],
                    count: 6
                });

                if (result && result.response) {
                    const resultImages = (result.response as Array<Record<string, any>>);
                    setImages(resultImages);
                } else {
                    console.error('Unable to get photos from unsplash!');
                }
            } catch (e) {
                console.log(e);
                setImages(defaultImages);
            } finally {
                setIsLoading(false);
            }
        };

        imagesFetch();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-6">
                <Loader2
                    className="size-6 text-sky-700 animate-spin"
                />
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {
                    images.map((image) => (
                        <div 
                            key={image.id}
                            className={cn(
                                'relative cursor-pointer aspect-video group hover:opacity-75 bg-muted transition',
                                pending && 'cursor-auto opacity-50 hover:opacity-50')
                            }
                            onClick={() => {
                                if (pending) return;
                                setSelectedImageID(image.id);
                            }}
                        >
                            <input 
                                type="radio"
                                id={id}
                                name={id}
                                className="hidden"
                                checked={selectedImageID === image.id}
                                disabled={pending}
                                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                            />
                            <Image
                                className="object-cover rounded-sm"
                                src={image.urls.thumb}
                                alt="Unsplash picker image"
                                fill
                            />
                            {
                                selectedImageID === image.id && (
                                    <div className="flex items-center justify-center inset-y-0 absolute size-full bg-black/40">
                                        <Check 
                                            className="size-4 text-slate-200"
                                        />
                                    </div>
                                )
                            }
                            <Link
                                className="text-slate-200 p-1 bg-black/60 opacity-0 group-hover:opacity-100 bottom-0 w-full text-[10px] truncate absolute hover:underline"
                                href={image.links.html}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {image.user.name}
                            </Link>
                        </div>
                    ))
                }
            </div>
            <FormErrors
                id="image"
                errors={errors}
            />
        </div>
    );
};