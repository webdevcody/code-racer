export function getRoomParticipantId({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  return `${roomId}-${userId}`;
}
