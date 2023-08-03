import { Prisma, type User } from "@prisma/client";

function generateRandomCPM() {
    return new Prisma.Decimal(Math.floor(Math.random() * (150 - 80) + 80));
}

function generateRandomAccuracy() {
    return new Prisma.Decimal(parseFloat((Math.random() * 30 + 70).toFixed(2)));
}

export const users: {
    id: User["id"];
    name: User["name"];
    averageCpm: User["averageCpm"];
    averageAccuracy: User["averageAccuracy"];
    // Racesplayed, this would required more seeds to be made avoiding for now
    topLanguages: User["topLanguages"];
}[] = [
        {
            id: "clktzbpun000008jv0wnqgwxz",
            name: "Cody",
            averageCpm: generateRandomCPM(),
            averageAccuracy: generateRandomAccuracy(),
            topLanguages: ["typescript", "go", "c#"]
        },
        {
            id: "clktzpq7m000008jv3l0u7a88",
            name: "Chris",
            averageCpm: generateRandomCPM(),
            averageAccuracy: generateRandomAccuracy(),
            topLanguages: ["typescript", "python"]
        },
        {
            id: "clktzpunl000108jvhyza3x0z",
            name: "Jordan",
            averageCpm: generateRandomCPM(),
            averageAccuracy: generateRandomAccuracy(),
            topLanguages: ["typescript", "go", "html"]
        },
        {
            id: "clktzpyd3000208jv99s31kgm",
            name: "Bob",
            averageCpm: generateRandomCPM(),
            averageAccuracy: generateRandomAccuracy(),
            topLanguages: ["html", "java"]
        },
        {
            id: "clktzq13s000308jv71zwbht0",
            name: "Alice",
            averageCpm: generateRandomCPM(),
            averageAccuracy: generateRandomAccuracy(),
            topLanguages: ["php", "go"]
        }
    ]

export default users;