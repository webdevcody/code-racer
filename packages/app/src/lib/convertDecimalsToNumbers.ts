import { Decimal } from "@prisma/client/runtime/library";

// TODO: this feels gross
export function convertDecimalsToNumbers(obj: any): any {
  if (obj instanceof Decimal) {
    return obj.toNumber();
  } else if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map((item) => convertDecimalsToNumbers(item));
    } else {
      const result: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = convertDecimalsToNumbers(obj[key]);
        }
      }
      return result;
    }
  } else if (
    typeof obj === "string" ||
    typeof obj === "number" ||
    typeof obj === "boolean"
  ) {
    return obj;
  } else {
    return null; // Or handle other types as needed
  }
}
