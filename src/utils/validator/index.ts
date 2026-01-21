import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";

import { ValidationError } from "../errors/validation.error";

const ajv = new Ajv({ allErrors: true, useDefaults: true, coerceTypes: true });
addFormats(ajv);
addKeywords(ajv)

export function validateParams<T>(schema: JSONSchemaType<T>) {
  return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFn = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const [params] = args;
      const valid = ajv.validate(schema, params as T);
      if (!valid) {
        throw new ValidationError("Validation Error", ajv.errors);
      }

      return originalFn.apply(this, args);
    };
  };
}
