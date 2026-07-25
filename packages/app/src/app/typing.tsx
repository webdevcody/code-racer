"use client"

import React, { useEffect, useState } from "react"

const text = "Page Not Found"

export const Typing = () => {
    const [typingText, setTypingText] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTypingText(text.slice(0, typingText.length + 1))
        }, 300)

        return () => clearTimeout(timeout)
    }, [typingText])

    return (
        <div className="flex flex-col text-center gap-8">
            <span className=" text-primary text-8xl font-bold ">404</span>
            <span className=" text-primary blinking-cursor text-4xl font-bold ">{typingText}</span>
        </div>
    )
}
