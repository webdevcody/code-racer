import type { Participant, RunningGameInformation, TimeStampType } from "./types";
import LinkedListMemory from "./data-structure";
import { RUNNING_RACE_KEYS } from "../consts";

class RunningTypingGameMemoryStore extends LinkedListMemory<
	RunningGameInformation,
	keyof RunningGameInformation
> {
	constructor() {
		super();
	}

	addRunningGame(room: RunningGameInformation): void {
		this.append(room);
	}

	getRunningGame(roomID: string): RunningGameInformation | undefined {
		return this.getItemIfStringEqualToKeyValue(roomID, RUNNING_RACE_KEYS.roomID)
			?.value;
	}

	removeRunningGame(roomID: string): RunningGameInformation | undefined {
		return this.removeItemIfStringEqualToKeyValue(
			roomID,
			RUNNING_RACE_KEYS.roomID,
		)?.value;
	}

	addParticipant(roomID: string, participant: Participant): void {
		const foundRunningRoom = this.getRunningGame(roomID);
		if (!foundRunningRoom) {
			console.warn(
				"Trying to add a participant to a room that still has not started! It is not included in the memory of running/ongoing races.",
			);
			return;
		}
		foundRunningRoom.participants.append(participant);
	}

	updateProgressOfParticipant(
		roomID: string,
		userID: string,
		amount: number,
	): Participant | undefined {
		const foundRunningRoom = this.getRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Trying to update the progress of a participant in a room that has not started yet! It is not included in the memory of running/ongoing races.",
			);
			return;
		}

		return foundRunningRoom.participants.updateProgress(userID, amount);
	}

	updateTimeStampOfParticipant(
		roomID: string,
		userID: string,
		timeStamp: TimeStampType
	): Participant | undefined {
		const foundRunningRoom = this.getRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Trying to update the timestamp of a participant in a room that has not started yet! It does not exist in the memory of running/ongoing races."
			);
			return;
		}
		return foundRunningRoom.participants.updateTimeStamp(userID, timeStamp);
	}

	updateTimeTakenOfParticipant(
		roomID: string,
		userID: string,
		timeInSeconds: number,
	): Participant | undefined {
		const foundRunningRoom = this.getRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Trying to update the total time taken of a participant in a room that has not started yet! It is not included in the memory of running/ongoing races.",
			);
			return;
		}
		return foundRunningRoom.participants.updateTimeTaken(userID, timeInSeconds);
	}

	removeParticipant(roomID: string, userID: string): Participant | undefined {
		const foundRunningRoom = this.getRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Trying to update the cpm of a participant in a room that has not started yet! It is not included in the memory of running/ongoing races.",
			);
			return;
		}

		return foundRunningRoom.participants.removeParticipant(userID);
	}

	getAllParticipants(roomID: string): Participant[] | undefined {
		const foundRunningRoom = this.getRunningGame(roomID);

		if (!foundRunningRoom) {
			console.warn(
				"Trying to all participants in a room that has not started yet! It is not included in the memory of running/ongoing races.",
			);
			return;
		}
		return foundRunningRoom.participants.getAllParticipants();
	}
}

export default RunningTypingGameMemoryStore;
