"use client";

import { useEffect, useState } from "react";

type State = string[];

let memoryState: State = [];

const listeners = new Set<(state: State) => void>();

const TOAST_REMOVE_DELAY = 60_000;

type Action =
  | {
      type: ActionType["ADD_CONFETTI"];
      confettiId: string;
    }
  | {
      type: ActionType["REMOVE_CONFETTI"];
      confettiId?: string;
    };

type ActionType = typeof actionTypes;

const actionTypes = {
  ADD_CONFETTI: "ADD_CONFETTI",
  REMOVE_CONFETTI: "REMOVE_CONFETTI",
} as const;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_CONFETTI":
      return [...state, action.confettiId];

    case "REMOVE_CONFETTI":
      if (!action.confettiId) return [];
      return state.filter((id) => id !== action.confettiId);
  }
};

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function tossConfetti(confettiId?: string) {
  if (!confettiId) {
    confettiId = (Math.random() + 1).toString(36).substring(2);
  }

  dispatch({ type: "ADD_CONFETTI", confettiId });

  setTimeout(() => {
    dispatch({ type: "REMOVE_CONFETTI", confettiId });
  }, TOAST_REMOVE_DELAY);
}

function useConfetti() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.add(setState);

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return {
    confetti: state,
    tossConfetti,
  };
}

export { useConfetti, tossConfetti };
