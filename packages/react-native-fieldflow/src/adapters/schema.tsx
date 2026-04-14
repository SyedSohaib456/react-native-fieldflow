/**
 * Schema-to-form generator — creates a form from a Zod or Yup schema.
 */

import React from 'react';
import { FieldForm } from '../core/FieldForm';
import { FieldInput } from '../fields/FieldInput';
import { FieldAmount } from '../fields/FieldAmount';
import { FieldDate } from '../fields/FieldDate';
import { FieldSelect } from '../fields/FieldSelect';
import { FieldTags } from '../fields/FieldTags';
import { FieldPassword } from '../fields/FieldPassword';
import type { SchemaFormConfig } from '../types';

// ─── Zod inference helpers ───────────────────────────────────────────────────

function inferFieldTypeFromZod(zodField: any): {
  component: any;
  props: Record<string, any>;
} {
  // Detect Zod type
  const typeName = zodField?._def?.typeName;

  switch (typeName) {
    case 'ZodString': {
      const checks = zodField._def?.checks ?? [];
      const isEmail = checks.some((c: any) => c.kind === 'email');
      const isUrl = checks.some((c: any) => c.kind === 'url');
      const minCheck = checks.find((c: any) => c.kind === 'min');
      const maxCheck = checks.find((c: any) => c.kind === 'max');

      if (isEmail) {
        return {
          component: FieldInput,
          props: {
            keyboardType: 'email-address',
            rules: { required: true, email: true },
          },
        };
      }

      if (isUrl) {
        return {
          component: FieldInput,
          props: {
            keyboardType: 'url',
            rules: { required: true, url: true },
          },
        };
      }

      const rules: Record<string, any> = {};
      if (minCheck) rules.minLength = minCheck.value;
      if (maxCheck) rules.maxLength = maxCheck.value;

      return { component: FieldInput, props: { rules } };
    }

    case 'ZodNumber': {
      const checks = zodField._def?.checks ?? [];
      const minCheck = checks.find((c: any) => c.kind === 'min');
      const maxCheck = checks.find((c: any) => c.kind === 'max');

      return {
        component: FieldAmount,
        props: {
          min: minCheck?.value,
          max: maxCheck?.value,
          rules: { required: true },
        },
      };
    }

    case 'ZodBoolean':
      return { component: FieldInput, props: {} };

    case 'ZodDate':
      return { component: FieldDate, props: { mode: 'date', rules: { required: true } } };

    case 'ZodEnum':
      return {
        component: FieldSelect,
        props: {
          options: (zodField._def?.values ?? []).map((v: string) => ({
            label: v.charAt(0).toUpperCase() + v.slice(1),
            value: v,
          })),
          rules: { required: true },
        },
      };

    case 'ZodArray':
      return { component: FieldTags, props: { rules: { required: true } } };

    default:
      return { component: FieldInput, props: {} };
  }
}

/**
 * Generate a fully rendered form from a Zod schema.
 */
export function createForm<T extends Record<string, any>>(
  schema: any,
  config: SchemaFormConfig<T>,
): React.ComponentType {
  // Extract fields from Zod schema
  const shape = schema?.shape ?? schema?._def?.shape?.();

  if (!shape) {
    throw new Error(
      'createForm: schema must be a Zod object schema (z.object({ ... })).',
    );
  }

  function SchemaForm() {
    const fields = Object.entries(shape).map(([name, zodField]) => {
      const inferred = inferFieldTypeFromZod(zodField);
      const overrides = (config.fieldConfig as any)?.[name] ?? {};

      // Check if it's a password field
      const isPassword = name.toLowerCase().includes('password');
      const Component = isPassword ? FieldPassword : inferred.component;

      // Auto-generate label from field name
      const label = name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();

      return (
        <Component
          key={name}
          name={name}
          label={label}
          {...inferred.props}
          {...overrides}
        />
      );
    });

    return (
      <FieldForm
        onSubmit={config.onSubmit as any}
        persistKey={config.persistKey}
      >
        {fields}
      </FieldForm>
    );
  }

  SchemaForm.displayName = 'SchemaForm';
  return SchemaForm;
}

/**
 * Create a form from a Yup schema.
 */
createForm.fromYup = function fromYup<T extends Record<string, any>>(
  schema: any,
  config: SchemaFormConfig<T>,
): React.ComponentType {
  const fields = schema?.fields ?? {};
  const zodLikeShape: Record<string, any> = {};

  Object.entries(fields).forEach(([name, yupField]: [string, any]) => {
    const type = yupField?.type;
    zodLikeShape[name] = {
      _def: {
        typeName: type === 'number' ? 'ZodNumber'
          : type === 'date' ? 'ZodDate'
          : type === 'array' ? 'ZodArray'
          : 'ZodString',
      },
    };
  });

  const fakeSchema = { shape: zodLikeShape };
  return createForm(fakeSchema, config);
};
