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
const chartTimeStampSchema = z.array(
  z.object({
    char: z.string(),
    accuracy: z.number(),
    cpm: z.number(),
    time: z.number(),
  })
);
const replayTimestampSchema = z.array(
  z.object({
    char: z.string(),
    time: z.number(),
  })
);

const RaceDispatchStateSchema = z.object({
  input: z.string(),
  snippet: snippetSchema,
  startTime: z.optional(dateType),
  totalErrors: z.number(),
  chartTimeStamp: chartTimeStampSchema,
  replayTimestamp: replayTimestampSchema,
  displayedErrorMessage: z.string(),
  totalTime: z.number()
});
const RaceDispatchActionSchema = z.object({
  type: z.union([
    z.literal("change_input"),
    z.literal("change_snippet"),
    z.literal("add_errors"),
    z.literal("set_start_time"),
    z.literal("change_chart_timestamp"),
    z.literal("change_replay_timestamp"),
    z.literal("reset"),
    z.literal("display_error_message"),
    z.literal("add_total_time")
  ]),
  payload: z
    .union([
      z.string(),
      snippetSchema,
      z.number(),
      dateType,
      chartTimeStampSchema,
      replayTimestampSchema,
      z.null(),
    ])
    .optional(),
});

export type RaceDispatchStateSchemaType = z.infer<
  typeof RaceDispatchStateSchema
>;
chartTimeStampSchema
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
 *  Chart Time Stamp State Change
 *  ---
 *  @requires chartTimeStampSchema
 *  
 *  Replay Time Stamp State Change
 *  ---
 *  @requires replayTimestampSchema
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
    code: ""
  },
  totalErrors: 0,
  startTime: undefined,
  chartTimeStamp: [],
  replayTimestamp: [],
  displayedErrorMessage: "",
  totalTime: 0
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
      state.totalErrors += action.payload;
      break;
    case "change_chart_timestamp":
      state.chartTimeStamp = chartTimeStampSchema.parse(action.payload);
      break;
    case "change_replay_timestamp":
      state.replayTimestamp = replayTimestampSchema.parse(action.payload);
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
      state.chartTimeStamp = [];
      state.replayTimestamp = [];
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
    replayTimestamp: state.replayTimestamp,
    startTime: state.startTime,
    chartTimeStamp: state.chartTimeStamp,
    displayedErrorMessage: state.displayedErrorMessage,
    totalTime: state.totalTime
  } satisfies RaceDispatchStateSchemaType;
};
