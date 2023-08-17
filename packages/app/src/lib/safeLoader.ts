/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type z, ZodTypeAny } from "zod";

export function safeLoader<
  LoaderInputs extends any[],
  OutputValidation extends ZodTypeAny
>({
  outputValidation,
  loader,
}: {
  outputValidation: OutputValidation;
  loader: (...argsList: LoaderInputs) => any;
}) {
  return async function (
    ...args: LoaderInputs
  ): Promise<z.infer<OutputValidation>> {
    const outputs = await loader.apply(null, args);
    const parsedOutput = outputValidation.parse(outputs);
    return parsedOutput;
  };
}
