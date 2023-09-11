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

		foundParticipant.value.timeStamp.push(timeStamp);
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
				timeStamp: currentNode.value.timeStamp,
				progress: currentNode.value.progress,
				timeTaken: currentNode.value.timeTaken,
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
				timeStamp: currentNode.value.timeStamp,
				progress: currentNode.value.progress,
				timeTaken: currentNode.value.timeTaken,
				isFinished: currentNode.value.isFinished,
			});
			currentNode = currentNode.next;
		}

		return participants;
	}

	/** Provide a userID if you want to exclude a user */
	getAllParticipantsProgress(
		userID?: string,
	): Array<ParticipantsProgressPayload> {
		let currentNode = this.getItemAt(0);
		const participants = new Array<ParticipantsProgressPayload>();

		for (let idx = 0; currentNode && idx < this.length; ++idx) {
			if (userID) {
				if (currentNode.value.userID === userID) {
					continue;
				}
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
