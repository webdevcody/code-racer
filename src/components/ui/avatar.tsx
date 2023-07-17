"use client";

import { cn } from "@/lib/utils";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";

interface AvatarProps {
    img: string;
    nameAbbreviation: string;
    className?: string;
    size?: "default" | "sm" | "md" | "lg";
}

const avatarVariances = cva(
    "flex justify-center items-center"
    , {
    variants: {
        size: {
            default: "w-20 h-20",
            sm: "w-10 h-10",
            md: "w-14 h-14",
            lg: "w-20 h-20",
        }
    }
})

const Avatar = ({img, nameAbbreviation, className, size = "default"} : AvatarProps) => {
    return (
        <RadixAvatar.Root
            asChild
            className={cn(className, avatarVariances({ size }))}
        >
            <div>
                <RadixAvatar.Image
                    className="w-full h-full rounded-full"
                    src={img}
                />
                <RadixAvatar.Fallback
                    className="bg-secondary rounded-full w-full h-full text-primary text-2xl font-bold flex items-center justify-center"
                >{nameAbbreviation.toUpperCase()}</RadixAvatar.Fallback>
            </div>
        </RadixAvatar.Root>
    )
}

export default Avatar;