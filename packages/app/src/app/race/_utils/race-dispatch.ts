"use client";

import { languageTypes } from "@/lib/validations/room";
import { z } from "zod";

const snippetSchema = z.object({
  name: z.union([z.string(), z.null()]),
  code: z.string(),
  id: z.string(),
  language: languageTypes,
});

const dateType = z.date().or(z.string().transform((val) => new Date(val)));
const singleTimeStampSchema = z.object({
  word: z.string(),
  accuracy: z.number(),
  cpm: z.number(),
  time: z.number(),
  errors: z.number(),
});

export const timeStampSchema = z.array(singleTimeStampSchema);

const RaceDispatchStateSchema = z.object({
  input: z.string(),
  snippet: snippetSchema,
  startTime: z.optional(dateType),
  totalErrors: z.number(),
  timeStamp: timeStampSchema,
  displayedErrorMessage: z.string(),
  totalTime: z.number(),
});
const RaceDispatchActionSchema = z.object({
  type: z.union([
    z.literal("change_input"),
    z.literal("change_snippet"),
    z.literal("add_errors"),
    z.literal("set_start_time"),
    z.literal("change_timestamp"),
    z.literal("reset"),
    z.literal("display_error_message"),
    z.literal("add_total_time"),
  ]),
  payload: z
    .union([
      z.string(),
      snippetSchema,
      z.number(),
      dateType,
      timeStampSchema,
      z.null(),
    ])
    .optional(),
});

export type RaceDispatchStateSchemaType = z.infer<
  typeof RaceDispatchStateSchema
>;

/** Respective actions to payload:
 *
 *  Input State Change
 *  ===
 *  @requires string
 *
 *  Snippet State Change
 *  ---
 *  @requires Snippet
 *
 *  Total Errors State Chamge
 *  ---
 *  @requires number "(How many errors to add?)"
 *
 *  Set Start Time
 *  ---
 *  @requires Date | void
 *
 *  Time Stamp State Change
 *  ---
 *  @requires TimeStampSchema
 *
 *  Reset State
 *  ---
 *  @requires void
 *
 *  Display Error Message
 *  ---
 *  @requires string
 */
export type RaceDispatchActionType = z.infer<typeof RaceDispatchActionSchema>;

const throwError = (type: string) => {
  throw new Error(
    "Invalid action payload type for action type " +
      type +
      ". It must be a number."
  );
};

export const RaceDispatchInitialState: RaceDispatchStateSchemaType = {
  input: "",
  snippet: {
    name: "",
    language: "c#",
    id: "",
    code: "",
  },
  totalErrors: 0,
  startTime: undefined,
  timeStamp: [],
  displayedErrorMessage: "",
  totalTime: 0,
};

export const RaceDispatch = (
  state: RaceDispatchStateSchemaType,
  action: RaceDispatchActionType
) => {
  switch (action.type) {
    case "change_input":
      if (typeof action.payload !== "string") {
        return throwError(action.type);
      }
      state.input = action.payload;
      if (state.displayedErrorMessage) {
        state.displayedErrorMessage = "";
      }
      break;
    case "add_errors":
      if (typeof action.payload !== "number") {
        return throwError(action.type);
      }
      state.totalErrors = state.totalErrors + action.payload;
      break;
    case "change_timestamp":
      const parsedTimeStampPayload = timeStampSchema.parse(action.payload);
      state.timeStamp.push(parsedTimeStampPayload[0]);
      break;
    case "set_start_time":
      if (action.payload) {
        if (!(action.payload instanceof Date)) {
          return throwError(action.type);
        }
        state.startTime = action.payload;
        break;
      }
      state.startTime = new Date();
      break;
    case "change_snippet":
      state.snippet = snippetSchema.parse(action.payload);
      break;
    case "reset":
      state.input = "";
      state.timeStamp = [];
      state.startTime = undefined;
      state.totalErrors = 0;
      state.displayedErrorMessage = "";
      state.totalTime = 0;
      break;
    case "display_error_message":
      if (typeof action.payload !== "string") {
        return throwError(action.type);
      }
      state.displayedErrorMessage = action.payload;
      break;
    case "add_total_time":
      if (typeof action.payload !== "number") {
        return throwError(action.type);
      }
      state.totalTime = +(state.totalTime + action.payload).toFixed(1);
      break;
    default:
      return state;
  }

  return {
    input: state.input,
    totalErrors: state.totalErrors,
    snippet: state.snippet,
    timeStamp: state.timeStamp,
    startTime: state.startTime,
    displayedErrorMessage: state.displayedErrorMessage,
    totalTime: state.totalTime,
  } satisfies RaceDispatchStateSchemaType;
};
