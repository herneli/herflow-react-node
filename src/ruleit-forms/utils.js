import fill from "core-js/library/fn/array/fill";
import validateFormData from "./validate";

export const ADDITIONAL_PROPERTY_FLAG = "__additional_property";

export function isObject(thing) {
  return typeof thing === "object" && thing !== null && !Array.isArray(thing);
}

export function getDefaultFormState(_schema, formData, definitions = {}) {
  if (!isObject(_schema)) {
    throw new Error("Invalid schema: " + _schema);
  }
  const schema = retrieveSchema(_schema, definitions, formData);
  const defaults = computeDefaults(schema, _schema.default, definitions);
  if (typeof formData === "undefined") {
    // No form data? Use schema defaults.
    return defaults;
  }
  if (isObject(formData)) {
    // Override schema defaults with form data.
    return mergeObjects(defaults, formData);
  }
  return formData || defaults;
}

export function mergeObjects(obj1, obj2, concatArrays = false) {
  // Recursively merge deeply nested objects.
  var acc = Object.assign({}, obj1); // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key];
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays);
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
}

export function retrieveSchema(schema, definitions = {}, formData = {}) {
  const resolvedSchema = resolveSchema(schema, definitions, formData);
  const hasAdditionalProperties =
    resolvedSchema.hasOwnProperty("additionalProperties") &&
    resolvedSchema.additionalProperties !== false;
  if (hasAdditionalProperties) {
    return stubExistingAdditionalProperties(
      resolvedSchema,
      definitions,
      formData
    );
  }
  return resolvedSchema;
}

export function resolveSchema(schema, definitions = {}, formData = {}) {
  if (schema.hasOwnProperty("$ref")) {
    return resolveReference(schema, definitions, formData);
  } else if (schema.hasOwnProperty("dependencies")) {
    const resolvedSchema = resolveDependencies(schema, definitions, formData);
    return retrieveSchema(resolvedSchema, definitions, formData);
  } else {
    // No $ref or dependencies attribute found, returning the original schema.
    return schema;
  }
}

function resolveReference(schema, definitions, formData) {
  // Retrieve the referenced schema definition.
  const $refSchema = findSchemaDefinition(schema.$ref, definitions);
  // Drop the $ref property of the source schema.
  const { $ref, ...localSchema } = schema;
  // Update referenced schema definition with local schema properties.
  return retrieveSchema(
    { ...$refSchema, ...localSchema },
    definitions,
    formData
  );
}

// This function will create new "properties" items for each key in our formData
export function stubExistingAdditionalProperties(
  schema,
  definitions = {},
  formData = {}
) {
  // Clone the schema so we don't ruin the consumer's original
  schema = {
    ...schema,
    properties: { ...schema.properties }
  };
  Object.keys(formData).forEach(key => {
    if (schema.properties.hasOwnProperty(key)) {
      // No need to stub, our schema already has the property
      return;
    }
    const additionalProperties = schema.additionalProperties.hasOwnProperty(
      "type"
    )
      ? { ...schema.additionalProperties }
      : { type: guessType(formData[key]) };
    // The type of our new key should match the additionalProperties value;
    schema.properties[key] = additionalProperties;
    // Set our additional property flag so we know it was dynamically added
    schema.properties[key][ADDITIONAL_PROPERTY_FLAG] = true;
  });
  return schema;
}

// In the case where we have to implicitly create a schema, it is useful to know what type to use
//  based on the data we are defining
export const guessType = function guessType(value) {
  if (Array.isArray(value)) {
    return "array";
  } else if (typeof value === "string") {
    return "string";
  } else if (value == null) {
    return "null";
  } else if (typeof value === "boolean") {
    return "boolean";
  } else if (!isNaN(value)) {
    return "number";
  } else if (typeof value === "object") {
    return "object";
  }
  // Default to string if we can't figure it out
  return "string";
};

function computeDefaults(schema, parentDefaults, definitions = {}) {
  // Compute the defaults recursively: give highest priority to deepest nodes.
  let defaults = parentDefaults;
  if (isObject(defaults) && isObject(schema.default)) {
    // For object defaults, only override parent defaults that are defined in
    // schema.default.
    defaults = mergeObjects(defaults, schema.default);
  } else if ("default" in schema) {
    // Use schema defaults for this node.
    defaults = schema.default;
  } else if ("$ref" in schema) {
    // Use referenced schema defaults for this node.
    const refSchema = findSchemaDefinition(schema.$ref, definitions);
    return computeDefaults(refSchema, defaults, definitions);
  } else if (isFixedItems(schema)) {
    defaults = schema.items.map(itemSchema =>
      computeDefaults(itemSchema, undefined, definitions)
    );
  }
  // Not defaults defined for this node, fallback to generic typed ones.
  if (typeof defaults === "undefined") {
    defaults = schema.default;
  }

  switch (schema.type) {
    // We need to recur for object schema inner default values.
    case "object":
      return Object.keys(schema.properties || {}).reduce((acc, key) => {
        // Compute the defaults for this node, with the parent defaults we might
        // have from a previous run: defaults[key].
        acc[key] = computeDefaults(
          schema.properties[key],
          (defaults || {})[key],
          definitions
        );
        return acc;
      }, {});

    case "array":
      if (schema.minItems) {
        if (!isMultiSelect(schema, definitions)) {
          const defaultsLength = defaults ? defaults.length : 0;
          if (schema.minItems > defaultsLength) {
            const defaultEntries = defaults || [];
            // populate the array with the defaults
            const fillerEntries = fill(
              new Array(schema.minItems - defaultsLength),
              computeDefaults(schema.items, schema.items.defaults, definitions)
            );
            // then fill up the rest with either the item default or empty, up to minItems

            return defaultEntries.concat(fillerEntries);
          }
        } else {
          return [];
        }
      }
  }

  return defaults;
}

function resolveDependencies(schema, definitions, formData) {
  // Drop the dependencies from the source schema.
  let { dependencies = {}, ...resolvedSchema } = schema;
  // Process dependencies updating the local schema properties as appropriate.
  for (const dependencyKey in dependencies) {
    // Skip this dependency if its trigger property is not present.
    if (formData[dependencyKey] === undefined) {
      continue;
    }
    const dependencyValue = dependencies[dependencyKey];
    if (Array.isArray(dependencyValue)) {
      resolvedSchema = withDependentProperties(resolvedSchema, dependencyValue);
    } else if (isObject(dependencyValue)) {
      resolvedSchema = withDependentSchema(
        resolvedSchema,
        definitions,
        formData,
        dependencyKey,
        dependencyValue
      );
    }
  }
  return resolvedSchema;
}

function findSchemaDefinition($ref, definitions = {}) {
  // Extract and use the referenced definition if we have it.
  const match = /^#\/definitions\/(.*)$/.exec($ref);
  if (match && match[1]) {
    const parts = match[1].split("/");
    let current = definitions;
    for (let part of parts) {
      part = part.replace(/~1/g, "/").replace(/~0/g, "~");
      if (current.hasOwnProperty(part)) {
        current = current[part];
      } else {
        // No matching definition found, that's an error (bogus schema?)
        throw new Error(`Could not find a definition for ${$ref}.`);
      }
    }
    return current;
  }

  // No matching definition found, that's an error (bogus schema?)
  throw new Error(`Could not find a definition for ${$ref}.`);
}

export function isFixedItems(schema) {
  return (
    Array.isArray(schema.items) &&
    schema.items.length > 0 &&
    schema.items.every(item => isObject(item))
  );
}

export function isMultiSelect(schema, definitions = {}) {
  if (!schema.uniqueItems || !schema.items) {
    return false;
  }
  return isSelect(schema.items, definitions);
}

function withDependentProperties(schema, additionallyRequired) {
  if (!additionallyRequired) {
    return schema;
  }
  const required = Array.isArray(schema.required)
    ? Array.from(new Set([...schema.required, ...additionallyRequired]))
    : additionallyRequired;
  return { ...schema, required: required };
}

function withDependentSchema(
  schema,
  definitions,
  formData,
  dependencyKey,
  dependencyValue
) {
  let { oneOf, ...dependentSchema } = retrieveSchema(
    dependencyValue,
    definitions,
    formData
  );
  schema = mergeSchemas(schema, dependentSchema);
  // Since it does not contain oneOf, we return the original schema.
  if (oneOf === undefined) {
    return schema;
  } else if (!Array.isArray(oneOf)) {
    throw new Error(`invalid: it is some ${typeof oneOf} instead of an array`);
  }
  // Resolve $refs inside oneOf.
  const resolvedOneOf = oneOf.map(subschema =>
    subschema.hasOwnProperty("$ref")
      ? resolveReference(subschema, definitions, formData)
      : subschema
  );
  return withExactlyOneSubschema(
    schema,
    definitions,
    formData,
    dependencyKey,
    resolvedOneOf
  );
}

function withExactlyOneSubschema(
  schema,
  definitions,
  formData,
  dependencyKey,
  oneOf
) {
  const validSubschemas = oneOf.filter(subschema => {
    if (!subschema.properties) {
      return false;
    }
    const { [dependencyKey]: conditionPropertySchema } = subschema.properties;
    if (conditionPropertySchema) {
      const conditionSchema = {
        type: "object",
        properties: {
          [dependencyKey]: conditionPropertySchema
        }
      };
      const { errors } = validateFormData(formData, conditionSchema);
      return errors.length === 0;
    }
  });
  if (validSubschemas.length !== 1) {
    console.warn(
      "ignoring oneOf in dependencies because there isn't exactly one subschema that is valid"
    );
    return schema;
  }
  const subschema = validSubschemas[0];
  const {
    [dependencyKey]: conditionPropertySchema,
    ...dependentSubschema
  } = subschema.properties;
  const dependentSchema = { ...subschema, properties: dependentSubschema };
  return mergeSchemas(
    schema,
    retrieveSchema(dependentSchema, definitions, formData)
  );
}

export function isSelect(_schema, definitions = {}) {
  const schema = retrieveSchema(_schema, definitions);
  const altSchemas = schema.oneOf || schema.anyOf;
  if (Array.isArray(schema.enum)) {
    return true;
  } else if (Array.isArray(altSchemas)) {
    return altSchemas.every(altSchemas => isConstant(altSchemas));
  }
  return false;
}

/**
 * This function checks if the given schema matches a single
 * constant value.
 */
export function isConstant(schema) {
  return (
    (Array.isArray(schema.enum) && schema.enum.length === 1) ||
    schema.hasOwnProperty("const")
  );
}

function mergeSchemas(schema1, schema2) {
  return mergeObjects(schema1, schema2, true);
}
