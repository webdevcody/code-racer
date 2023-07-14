/** Thrown if a context value is not returned by useContext, since
 *  custom hooks that end with Context (e.g. useThemeContext) uses
 *  the useContext hook.
 *
 *  This means that a component is probably not wrapped inside the
 *  context's provider.
 *
 *  @param message The error message. Can be undefined.
 */
export class ContextDoesNotExistError extends Error {
  constructor(
    message = "Please make sure that the component using this is wrapped in the provider of the context you are trying the use.",
  ) {
    super(message);
    this.name = "ContextDoesNotExistError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "You are unauthorized to do this command") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends Error {
  constructor(errors: Record<string, string>) {
    super(JSON.stringify(errors));
    this.name = "ValidationError";
  }
}
