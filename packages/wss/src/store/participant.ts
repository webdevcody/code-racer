import type { Participant, TimeStampType } from "./types";
import type { ParticipantsProgressPayload } from "../events/server-to-client";
import { PARTICIPANT_KEYS } from "../consts";
import LinkedListMemory from "./data-structure";


const MAX_TRACKER_POSITION = 100;

class ParticipantMemoryStore extends LinkedListMemory<
	Participant,
	keyof Participant
> {
	constructor() {
		super();
	}

	updateProgress(userID: string, amount: number): Participant | undefined {
		const foundParticipant = this.getItemIfStringEqualToKeyValue(
			userID,
			PARTICIPANT_KEYS.userID,
		);
		if (!foundParticipant) {
			console.warn(
				"Trying to update the progress of a non-existent participant.",
			);
			return undefined;
		}

		if (amount >= MAX_TRACKER_POSITION) {
			foundParticipant.value.progress = MAX_TRACKER_POSITION;
		} else {
			foundParticipant.value.progress = amount;
		}

		return foundParticipant.value;
	}

	updateAccuracy(userID: string, accuracy: number): Participant | undefined {
		const foundParticipant = this.getItemIfStringEqualToKeyValue(
			userID,
			PARTICIPANT_KEYS.userID,
		);
		if (!foundParticipant) {
			console.warn(
				"Trying to update the accuracy of a non-existent participant.",
			);
			return undefined;
		}

		foundParticipant.value.accuracy = accuracy;
		return foundParticipant.value;
	}

	updateCpm(userID: string, cpm: number): Participant | undefined {
		const foundParticipant = this.getItemIfStringEqualToKeyValue(
			userID,
			PARTICIPANT_KEYS.userID,
		);
		if (!foundParticipant) {
			console.warn("Trying to update the cpm of a non-existent participant.");
			return undefined;
		}

		foundParticipant.value.cpm = cpm;
		return foundParticipant.value;
	}

	updateTotalErrors(
		userID: string,
		totalErrors: number,
	): Participant | undefined {
		const foundParticipant = this.getItemIfStringEqualToKeyValue(
			userID,
			PARTICIPANT_KEYS.userID,
		);
		if (!foundParticipant) {
			console.warn(
				"Trying to update the total errors of a non-existent participant.",
			);
			return undefined;
		}

		foundParticipant.value.totalErrors = totalErrors;
		return foundParticipant.value;
	}

	/** We update this when user finishes the snippet */
	updateTimeTaken(userID: string, timeTaken: number): Participant | undefined {
		const foundParticipant = this.getItemIfStringEqualToKeyValue(
			userID,
			PARTICIPANT_KEYS.userID,
		);
		if (!foundParticipant) {
			console.warn(
				"Trying to update the total time taken of a non-existent participant.",
			);
			return undefined;
		}

		foundParticipant.value.timeTaken = timeTaken;
		foundParticipant.value.isFinished = true;
		return foundParticipant.value;
	}

	/** to avoid repeated loops when
	 *  updating cpm, accuracy, & totalErrors
	 */
	updateTimeStamp(
		userID: string,
		timeStamp: TimeStampType,
	): Participant | undefined {
		const foundParticipant = this.getItemIfStringEqualToKeyValue(
			userID,
			PARTICIPANT_KEYS.userID,
		);
		if (!foundParticipant) {
			console.warn(
				"Trying to update the timeStamp of a non-existent participant.",
			);
			return undefined;
		}

		foundParticipant.value.cpm = timeStamp.cpm;
		foundParticipant.value.accuracy = timeStamp.accuracy;
		foundParticipant.value.totalErrors = timeStamp.errors;
		return foundParticipant.value;
	}

	checkIfAllParticipantsHaveFinished(): boolean {
		let currentNode = this.getItemAt(0);

		for (let idx = 0; currentNode && idx < this.length; ++idx) {
			if (!currentNode.value.isFinished) {
				return false;
			}
			currentNode = currentNode.next;
		}

		return true;
	}

	removeParticipant(userID: string): Participant | undefined {
		return this.removeItemIfStringEqualToKeyValue(
			userID,
			PARTICIPANT_KEYS.userID,
		)?.value;
	}

	getAllParticipants(): Array<Participant> {
		let currentNode = this.getItemAt(0);
		const participants = new Array<Participant>();

		for (let idx = 0; currentNode && idx < this.length; ++idx) {
			participants.push({
				userID: currentNode.value.userID,
				displayImage: currentNode.value.displayImage,
				displayName: currentNode.value.displayName,
				cpm: currentNode.value.cpm,
				accuracy: currentNode.value.accuracy,
				progress: currentNode.value.progress,
				timeTaken: currentNode.value.timeTaken,
				totalErrors: currentNode.value.totalErrors,
				isFinished: currentNode.value.isFinished,
			});
			currentNode = currentNode.next;
		}

		return participants;
	}

	getAllParticipantsExcept(userID: string): Array<Participant> {
		let currentNode = this.getItemAt(0);
		const participants = new Array<Participant>();

		for (let idx = 0; currentNode && idx < this.length; ++idx) {
			if (currentNode.value.userID === userID) {
				continue;
			}
			participants.push({
				userID: currentNode.value.userID,
				displayImage: currentNode.value.displayImage,
				displayName: currentNode.value.displayName,
				cpm: currentNode.value.cpm,
				accuracy: currentNode.value.accuracy,
				progress: currentNode.value.progress,
				timeTaken: currentNode.value.timeTaken,
				totalErrors: currentNode.value.totalErrors,
				isFinished: currentNode.value.isFinished,
			});
			currentNode = currentNode.next;
		}

		return participants;
	}

	getAllParticipantsProgressExcept(
		userID: string,
	): Array<ParticipantsProgressPayload> {
		let currentNode = this.getItemAt(0);
		const participants = new Array<ParticipantsProgressPayload>();

		for (let idx = 0; currentNode && idx < this.length; ++idx) {
			if (currentNode.value.userID === userID) {
				continue;
			}
			participants.push({
				userID: currentNode.value.userID,
				displayImage: currentNode.value.displayImage,
				progress: currentNode.value.progress,
				displayName: currentNode.value.displayName,
			});
			currentNode = currentNode.next;
		}

		return participants.sort((a, b) => {
			if (a.progress < b.progress) {
				return 1;
			}

			if (a.progress > b.progress) {
				return -1;
			}

			return 0;
		});
	}
}

export default ParticipantMemoryStore;
