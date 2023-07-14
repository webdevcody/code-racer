import React, { useContext, useState } from "react";
import Confetti from "react-confetti";

type ConfettiContextType = {
  showConfetti: () => void;
};

const ConfettiContext = React.createContext<ConfettiContextType>(
  {} as ConfettiContextType,
);

const ConfettiProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);

  const showConfetti = () => {
    setIsConfettiVisible(true);
  };

  const confettiContextValue: ConfettiContextType = {
    showConfetti: showConfetti,
  };
  return (
    <ConfettiContext.Provider value={confettiContextValue}>
      {children}
      {isConfettiVisible && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={800}
          tweenDuration={30000}
          initialVelocityY={-5}
        />
      )}
    </ConfettiContext.Provider>
  );
};

const useConfettiContext = () => useContext(ConfettiContext);
export { useConfettiContext };
export default ConfettiProvider;
