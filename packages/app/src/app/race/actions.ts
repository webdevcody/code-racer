"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { UnauthorizedError } from "@/lib/exceptions/custom-hooks";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validatedCallback } from "@/lib/validatedCallback";
import CryptoJS from "crypto-js";

export const getUserTokenAndStamp = async () => {
  const user = await getCurrentUser();

  if (!user) throw new UnauthorizedError();

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
  });

  console.log("userdata:", userData)
  if(!userData) return;

  let signToken = userData.signToken;
  let stamp = userData.stamp;
  
  if(userData!.signTokenValidity.getTime() < Date.now()){
    stamp = Math.random().toString(36).substring(2,7); 
    signToken = Math.random().toString(36).substring(2,22);
    
    console.log("Token invalid. Issue new token", userData.signToken, userData.stamp, signToken, stamp)
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          stamp: stamp,
          signToken: signToken,
          signTokenValidity: new Date(Date.now() + 1000*60*60*24*7),
        },
      })
    })
  }

  console.log("Valid?", userData!.signTokenValidity.getTime() < Date.now())
  console.log("Sign token (old new):",userData.signToken, signToken)
  console.log("Stamp (old new):", userData.stamp, stamp)

  return {
    "key": signToken,
    "stamp": stamp,
  }
};

export const saveUserResultAction = validatedCallback({
  inputValidation: z.object({
    raceParticipantId: z.string().optional(),
    timeTaken: z.union([z.string(), z.number()]),
    errors: z.number().nullable(),
    cpm: z.number(),
    accuracy: z.number().min(0).max(100),
    snippetId: z.string(),
    hash: z.string(),
  }),
  callback: async (input) => {
    const user = await getCurrentUser();

    if (!user) throw new UnauthorizedError();

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { results: true },
    });

    if (userData == null) throw new Error("User not found");

    let languagesMap: { [key: string]: number };

    if (userData.languagesMap == null) {
      languagesMap = {};
      const results = userData.results;
      results.forEach(async (result) => {
        const raceSnippet = await prisma.snippet.findUnique({
          select: { language: true },
          where: { id: result.snippetId },
        });

        if (Object.keys(languagesMap).includes(raceSnippet!.language)) {
          languagesMap[raceSnippet!.language] += 1;
        } else {
          languagesMap[raceSnippet!.language] = 1;
        }
      });
    } else {
      languagesMap = JSON.parse(userData.languagesMap as string);
    }

    const snippetData = await prisma.snippet.findUnique({
      select: { language: true },
      where: { id: input.snippetId },
    });

    if (Object.keys(languagesMap).includes(snippetData!.language!)) {
      languagesMap[snippetData!.language!] += 1;
    } else {
      languagesMap[snippetData!.language!] = 1;
    }

    const topLanguages = Object.keys(languagesMap)
      .sort((a, b) => languagesMap[b] - languagesMap[a])
      .splice(0, 3);

    // verify hash:
    console.log("Verfying")
    const tokenAndStamp = await getUserTokenAndStamp();
    const data = {
      timeTaken: input.timeTaken,
      errors: input.errors,
      cpm: input.cpm,
      accuracy: input.accuracy,
      snippetId: input.snippetId,
      stamp: tokenAndStamp!["stamp"],
    };
    const jsonData = JSON.stringify(data);
    const hashedData = CryptoJS.HmacSHA256(jsonData, tokenAndStamp!["key"]).toString();
    
    const stamp = Math.random().toString(36).substring(2,7);

    if (hashedData != input.hash.toString()) {
      console.log(jsonData, input.hash.toString(), hashedData);
      return "Invalid Request: Tampered Data";
    } else {
      // Request is valid
    }
    return await prisma.$transaction(async (tx) => {
      const result = await tx.result.create({
        data: {
          userId: user.id,
          takenTime: input.timeTaken.toString(),
          errorCount: input.errors,
          cpm: input.cpm,
          accuracy: new Prisma.Decimal(input.accuracy),
          snippetId: input.snippetId,
          RaceParticipant: input.raceParticipantId
            ? {
                connect: {
                  id: input.raceParticipantId,
                },
              }
            : undefined,
        },
      });

      const avgValues = await tx.result.aggregate({
        where: {
          userId: user.id,
        },
        _avg: {
          accuracy: true,
          cpm: true,
        },
      });

      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          averageAccuracy: avgValues._avg.accuracy ?? 0,
          averageCpm: avgValues._avg.cpm ?? 0,
          languagesMap: JSON.stringify(languagesMap),
          topLanguages: topLanguages,
          stamp: stamp,
        },
      });

      return result;
    });
  },
});

export const getParticipantUser = validatedCallback({
  inputValidation: z.object({
    participantId: z.string(),
  }),
  callback: async (input) => {
    const participant = await prisma.raceParticipant.findUnique({
      where: {
        id: input.participantId,
      },
    });

    if (!participant || !participant.userId) return null;

    const user = await prisma.user.findUnique({
      where: {
        id: participant.userId,
      },
      select: {
        name: true,
        image: true,
      },
    });

    return user;
  },
});

/**
 * This should create a private room for the user
 * Not implemented
 **/
