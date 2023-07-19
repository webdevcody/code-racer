"use client";

// import { updateUserFollowersAction } from "@/app/_actions/user";
import { Button } from "@/components/ui/button";

export default function NotCurrentUserButtons({
  followers,
  userInViewId,
  currentUserId,
}: {
  followers: string[];
  userInViewId: string;
  currentUserId: string;
}) {
  const isCurrentUserAFollower = followers.indexOf(currentUserId) !== -1;

  return (
    <>
      <Button
        variant={"outline"}
        onClick={async () => {
          // await updateUserFollowersAction({
          //     targetUserId: userInViewId,
          //     typeOfUpdate: isCurrentUserAFollower ? "unfollow" : "follow"
          // });
        }}
        disabled
        title={isCurrentUserAFollower ? "Follow" : "Unfollow"}
      >
        {isCurrentUserAFollower ? "Unfollow" : "Follow"}
      </Button>
    </>
  );
}
