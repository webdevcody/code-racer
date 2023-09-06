import type { Language } from "@code-racer/app/src/config/languages";

import { getRandomSnippet } from "@code-racer/app/src/app/race/(play)/loaders";

import { siteConfig } from "@code-racer/app/src/config/site";
import {
	Prisma,
	prisma,
	User,
	type Snippet,
	Race,
} from "@code-racer/app/src/lib/prisma";

type Data = {
	snippet: {
		connect: {
			id: string;
		};
	};
	id: string | undefined;
};

/**For logged in user, we choose race if:
 *  1. its selected language is the same
 *  2. hasn't started or ended yet
 *  3. all participants are logged in user
 *  4. race's participants has not reached maxiumun capacity
 *  5. participants stats most suitable to current user
 * For guest user, we choose race if:
 *  1. its selected language is the same
 *  2. hasn't started or ended yet
 *  3. all participants are guest user
 *  4. race's participants has not reached maxiumum capacity
 */

export class RaceStore {
	constructor() {}

	createRace(snippet: Snippet, roomID?: string) {
		const data = {
			snippet: {
				connect: { id: snippet.id },
			},
			id: roomID,
		} satisfies Data;

		return prisma.race.create({ data });
	}

	createRaceParticipant(
		raceToJoin: Prisma.RaceGetPayload<Record<string, never>>,
		userID: User["id"] | undefined,
	) {
		let user;

		if (userID) {
			user = {
				connect: { id: userID },
			};
		}

		const data = {
			user,
			Race: {
				connect: {
					id: raceToJoin.id,
				},
			},
		};

		return prisma.raceParticipant.create({ data });
	}

	async getAvailableRace(language: Language, userID: User["id"] | undefined) {
		let user;

		if (userID) {
			user = {
				isNot: null,
			};
		}

		const availableRaceRooms = await prisma.race.findMany({
			where: {
				snippet: { language },
				AND: [{ startedAt: null }, { endedAt: null }],
				participants: {
					every: { user },
				},
			},
			include: {
				participants: Boolean(userID),
				_count: {
					select: { participants: true },
				},
			},
		});

		let delta: number;

		for (let i = 0; i < availableRaceRooms.length; ++i) {
			const race = availableRaceRooms[i];
			const ROOM_IS_NOT_FULL =
				race._count.participants <
				siteConfig.multiplayer.maxParticipantsPerRace;
			if (ROOM_IS_NOT_FULL) {
				if (userID) {
					const userStatsWeight = await this.getUserStatsWeight(userID);
					const raceStatsWeight = await this.getRaceStatsWeight(race.id);

					// absolute value
					delta = Math.abs(userStatsWeight - raceStatsWeight);

					if (userStatsWeight - raceStatsWeight < delta) {
						delta = userStatsWeight - raceStatsWeight;
					}

					return race;
				}

				return race;
			}
		}

		// after looping through the availableRooms and the condition of
		// room is not full is not met, then that means
		// all rooms are full, so we create a new room
		const randomSnippet = await getRandomSnippet({ language });
		return this.createRace(randomSnippet);
	}

	async getUserStatsWeight(userID: User["id"]): Promise<number> {
		const user = await prisma.user.findFirst({
			select: {
				averageAccuracy: true,
				averageCpm: true,
			},
			where: {
				id: userID,
			},
		});

		if (!user) {
			throw new Error("User not found!");
		}

		// convert to number e.g. (+"9")
		return +user.averageAccuracy + +user.averageCpm / 2;
	}

	async getRaceStatsWeight(raceID: Race["id"]): Promise<number> {
		const participantsAverageStats = await prisma.user.aggregate({
			_avg: {
				averageAccuracy: true,
				averageCpm: true,
			},
			where: {
				RaceParticipant: {
					some: { raceId: raceID },
				},
			},
		});

		if (
			!participantsAverageStats._avg.averageAccuracy ||
			!participantsAverageStats._avg.averageCpm
		) {
			throw new Error("No average accuracy and cpm for this race!");
		}

		// convert to number e.g. (+"9")
		return (
			+participantsAverageStats._avg.averageAccuracy +
			+participantsAverageStats._avg.averageCpm / 2
		);
	}

	async raceMatchMaking(language: Language, userID?: string) {
		const race = await this.getAvailableRace(language, userID);
		const raceParticipant = await this.createRaceParticipant(race, userID);

		return { availableRace: race, raceParticipantID: raceParticipant.id };
	}
}
