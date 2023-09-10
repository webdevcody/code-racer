import { ParticipantInformation, UserSession } from "./types";

import LinkedListMemory from "./data-structure";
import { USER_SESSION_KEYS } from "../consts";

class UserSessionMemoryStore extends LinkedListMemory<UserSession, keyof UserSession> {
  constructor() {
    super();
  }

  addUser(userSession: UserSession): void {
    this.append(userSession);
  }

  findUser(userSession: UserSession): UserSession | undefined {
    return this.get(userSession, USER_SESSION_KEYS.userID)?.value;
  }

  findUserByID(userID: string): UserSession | undefined {
    return this.getItemIfStringEqualToKeyValue(userID, USER_SESSION_KEYS.userID)?.value;
  }

  removeUser(userSession: UserSession): UserSession | undefined {
    return this.remove(userSession, USER_SESSION_KEYS.userID)?.value;
  }

  removeUserByID(userID: string): UserSession | undefined {
    return this.removeItemIfStringEqualToKeyValue(userID, USER_SESSION_KEYS.userID)?.value;
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