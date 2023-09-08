"use client";

import { z } from "zod";

import { snippetSchema } from "@/lib/validations/snippet";

const dateType = z.date().or(z.string().transform((val) => new Date(val)));
const chartTimeStampSchema = z.object({
  char: z.string(),
  accuracy: z.number(),
  cpm: z.number(),
  time: z.number(),
});
const replayTimestampSchema = z.object({
  char: z.string(),
  time: z.number(),
});

const RaceDispatchStateSchema = z.object({
  input: z.string(),
  snippet: z.optional(snippetSchema),
  startTime: dateType,
  totalErrors: z.number(),
  chartTimeStamp: chartTimeStampSchema,
  replayTimestamp: replayTimestampSchema,
});

const RaceDispatchActionSchema = z.object({
  type: z.union([
    z.literal("change_input"),
    z.literal("change_snippet"),
    z.literal("add_errors"),
    z.literal("set_start_time"),
    z.literal("change_chart_timestamp"),
    z.literal("change_replay_timestamp"),
  ]),
  payload: z.union([
    z.string(),
    snippetSchema,
    z.number(),
    dateType,
    chartTimeStampSchema,
    replayTimestampSchema,
  ]),
});

export type RaceDispatchStateSchemaType = z.infer<
  typeof RaceDispatchStateSchema
>;
export type RaceDispatchActionType = z.infer<typeof RaceDispatchActionSchema>;

export const RaceDispatchInitialState: RaceDispatchStateSchemaType = {
  input: "",
  snippet: undefined,
  totalErrors: 0,
  startTime: new Date(),
  chartTimeStamp: {
    char: "",
    accuracy: 0,
    cpm: 0,
    time: 0,
  },
  replayTimestamp: {
    char: "",
    time: 0,
  },
};

export const RaceDispatch = (
  state: RaceDispatchStateSchemaType,
  action: RaceDispatchActionType
) => {
  switch (action.type) {
    case "change_input":
      if (typeof action.payload !== "string") {
        throw new Error(
          "Invalid action payload type for action type" +
            action.type +
            ". It must be a string."
        );
      }
      state.input += action.payload;
      break;
    case "add_errors":
      if (typeof action.payload !== "number") {
        throw new Error(
          "Invalid action payload type for action type " +
            action.type +
            ". It must be a number."
        );
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
      if (!(action.payload instanceof Date)) {
        throw new Error(
          "Invalid action payload type for action type " +
            action.type +
            ". It must be a Date object."
        );
      }
      state.startTime = action.payload;
      break;
    case "change_snippet":
      state.snippet = snippetSchema.parse(action.payload);
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
  } satisfies RaceDispatchStateSchemaType;
};
