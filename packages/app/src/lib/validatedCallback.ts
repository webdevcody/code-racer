import { z, ZodError, ZodTypeAny } from "zod";

type ValidatedCallbackOptions<
  CallbackInput,
  OutputValidation extends ZodTypeAny,
  InputValidation extends ZodTypeAny
> = {
  outputValidation?: OutputValidation;
  inputValidation?: InputValidation;
  callback: InputValidation extends ZodTypeAny
    ? (input: z.infer<InputValidation>) => any
    : (input: CallbackInput) => any;
};

export function validatedCallback<
  CallbackInput,
  OutputValidation extends ZodTypeAny,
  InputValidation extends ZodTypeAny
>(
  options: ValidatedCallbackOptions<
    CallbackInput,
    OutputValidation,
    InputValidation
  >
) {
  return async function (
    input: CallbackInput
  ): Promise<z.infer<OutputValidation>> {
    const passthrough = { parse: (i: any) => i };
    const { inputValidation, callback, outputValidation } = options;

    const validatedInput = (inputValidation ?? passthrough).parse(input);
    const outputs = await callback(validatedInput);
    const parsedOutput = (outputValidation ?? passthrough).parse(outputs);
    return parsedOutput;
  };
}
