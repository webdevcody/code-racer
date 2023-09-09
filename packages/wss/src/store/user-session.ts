import { ParticipantInformation, UserSession } from "./types";

import LinkedListMemory from "./memory";

class UserSessionMemoryStore extends LinkedListMemory<UserSession, keyof UserSession> {
  constructor() {
    super();
  }
  
  getAllUsers(): ParticipantInformation[] {
    let currentNode = this.getItemAt(0);
    const arrayOfUsers = new Array<ParticipantInformation>();

    for (let idx = 0; currentNode && idx < this.length; ++idx) {
			arrayOfUsers.push({
				userID: currentNode.value.userID,
				displayImage: currentNode.value.displayImage,
				displayName: currentNode.value.displayName,
			});
			currentNode = currentNode.next;
		}

		return arrayOfUsers;
  }
}

export default UserSessionMemoryStore;