import type { Race } from "@code-racer/app/src/lib/prisma";

export type UserRacePresencePayload = {
	raceParticipantId: string;
	socketId: string;
	race: Race;
};
