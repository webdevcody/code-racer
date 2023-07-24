import { type z, ZodError } from "zod";

type ActionType<InputType extends z.ZodTypeAny, ResponseType> = (
  input: z.infer<InputType>,
) => Promise<ResponseType>;

type validatedAction<InputType extends z.ZodTypeAny, ResponseType> = ActionType<
  InputType,
  ResponseType
>;

export function safeAction<InputType extends z.ZodTypeAny>(
  validator?: InputType,
) {
  return function <ResponseType>(action: ActionType<InputType, ResponseType>) {
    const validatedAction = async (input: z.infer<InputType>) => {
      if (validator) {
        try {
          validator.parse(input);
        } catch (err) {
          if (err instanceof ZodError) {
            throw new Error(err.issues.map((i) => i.message).join("\n"));
          } else {
            throw new Error("Something went wrong...");
          }
        }
      }
      return await action(input);
    };

    return validatedAction as validatedAction<InputType, ResponseType>;
  };
}
