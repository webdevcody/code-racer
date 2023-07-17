import { useEffect, useMemo, useRef } from "react";

export default function Follower({
  codeContainerRef,
  userInput,
}: {
  codeContainerRef: React.RefObject<HTMLPreElement>;
  userInput: string;
}) {
  const followerRef = useRef<HTMLDivElement>(null);

  // Every time the user types, update the follower
  useEffect(() => {
    updateFollower(codeContainerRef, followerRef, userInput);
  }, [codeContainerRef, userInput]);

  // Update the follower when the window resizes
  useEffect(() => {
    const resizeListener = () => {
      updateFollower(codeContainerRef, followerRef, userInput);
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, [codeContainerRef, userInput]);

  const FollowerBox = useMemo(() => {
    return (
      <div
        ref={followerRef}
        className="absolute border-b-2 border-primary opacity-70
                   transition-height transition-left transition-width duration-100 ease-linear"
      />
    );
  }, []);

  return <>{FollowerBox}</>;
}

const updateFollower = (
  codeContainerRef: React.RefObject<HTMLPreElement> | undefined,
  followerRef: React.RefObject<HTMLDivElement> | undefined,
  userInput: string,
) => {
  if (
    !codeContainerRef ||
    !followerRef ||
    !codeContainerRef.current ||
    !followerRef.current
  )
    return;

  // The span element the user is currently on
  const charInfo = codeContainerRef.current.children[
    userInput.length + 1
  ] as HTMLSpanElement;

  if (!charInfo) return;

  // If the user is goes to a new line, speed up the transition
  if (charInfo.offsetTop !== parseFloat(followerRef.current.style.top))
    followerRef.current.style.transitionDuration = "0.03s";
  else if (followerRef.current.style.transitionDuration !== "0.1s") {
    followerRef.current.style.transitionDuration = "0.1s";
  }

  followerRef.current.style.left = `${charInfo.offsetLeft}px`;
  followerRef.current.style.top = `${charInfo.offsetTop}px`;
  followerRef.current.style.height = `${charInfo.offsetHeight + 2}px`;
  followerRef.current.style.width = `${charInfo.offsetWidth}px`;
};
