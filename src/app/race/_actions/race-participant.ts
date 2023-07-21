"use server"

import { safeAction } from "@/lib/actions"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const getParticipantUser = safeAction(z.object({
    participantId: z.string(),
}))(async (input)=> {
    const participant = await prisma.raceParticipant.findUnique({
        where: {
            id: input.participantId,
        }
    })

    if(!participant || !participant.userId) return null

    const user = await prisma.user.findUnique({
        where: {
            id: participant.userId,
        },
        select: {
            name: true,
            image: true,
        }
    })

    return user
})
