import {
	prisma,
	type Race,
	type RaceParticipant,
} from "@code-racer/app/src/lib/prisma";

import type { RaceStatus } from "../consts";

export type SocketId = string;
export type Timestamp = number;

export type RaceWithParticipants = {
	race: Race;
	participants: Array<Participant>;
	status: RaceStatus;
};

export type Participant = {
	id: RaceParticipant["id"];
	position: number;
	finishedAt: Timestamp | null;
	image: string;
	name: string;
};

export class MemoryStore {
	private races: Map<string, RaceWithParticipants>;
	private participants: Map<SocketId, Participant>;

	constructor() {
		this.races = new Map<string, RaceWithParticipants>();
		this.participants = new Map<SocketId, Participant>();
	}

	findRace(id: string): RaceWithParticipants | undefined {
		return this.races.get(id);
	}

	saveRace(id: string, race: RaceWithParticipants) {
		this.races.set(id, race);
	}

	getAllRaces(): Array<RaceWithParticipants> {
		return [...this.races.values()];
	}

	removeRace(roomID: string): void {
		this.races.delete(roomID);
	}

	findRaceWhereParticipantIsIn(
		userID: string,
	): RaceWithParticipants | undefined {
		const races = this.getAllRaces();

		for (let idx = 0; idx < races.length; ++idx) {
			const participants = races[idx].participants;
			for (let j = 0; j < participants.length; ++j) {
				if (participants[j].id === userID) {
					return races[idx];
				}
			}
		}

		return undefined;
	}

	findAllParticipants(roomID: string): undefined | Array<Participant> {
		return this.races.get(roomID)?.participants;
	}

	findParticipant(id: string): Participant | undefined {
		return this.participants.get(id);
	}

	addParticipantToRace(roomID: string, participant: Participant): void | Error {
		const race = this.races.get(roomID);
		if (!race) {
			return new Error("No race to join.");
		}
		race?.participants.push(participant);
	}

	saveParticipant(userID: string, participantDetails: Participant) {
		this.participants.set(userID, participantDetails);
	}

	deleteAllParticipantsFromRace(roomID: string): void {
		const race = this.findRace(roomID);
		if (!race) {
			return;
		}

		for (let idx = 0; idx < race.participants.length; ++idx) {
			race.participants.pop();
			this.participants.delete(race.participants[idx].id);
		}
	}

	deleteRaceParticipant(
		raceParticipantId: string,
		room?: RaceWithParticipants,
	) {
		if (!room) {
			room = this.findRaceWhereParticipantIsIn(raceParticipantId);
		}
		if (!room) {
			console.error(
				"Player left a room that does not exist! Memory Manipulation went wrong! Cannot find race for participant deletion...",
			);
			return;
		}
		this.participants.delete(raceParticipantId);

		this.removeParticipantFromRace(room.race.id, raceParticipantId);
		return prisma.raceParticipant.delete({
			where: {
				id: raceParticipantId,
			},
		});
	}

	private removeParticipantFromRace(roomID: string, userID: string): void {
		const race = this.races.get(roomID);
		if (!race?.participants) {
			return;
		}
		const participants = race.participants;
		const removedParticipants = new Array<Participant>();

		for (let idx = participants.length - 1; idx >= 0; --idx) {
			if (participants[idx].id === userID) {
				participants.pop();
			} else {
				const removedParticipant = participants.pop();
				if (removedParticipant) {
					removedParticipants.push(removedParticipant);
				}
			}
		}

		for (let idx = 0; idx < removedParticipants.length; ++idx) {
			participants.push(removedParticipants[idx]);
		}
	}
}
