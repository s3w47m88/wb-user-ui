import { ComponentData } from "./supabase-content";

export type FormBlockType = "contact-form" | "volunteer-form";

export type FormFieldDefinition = {
  key: string;
  label: string;
};

export type FormDeliveryConfig = {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  intro: string;
  includedFieldKeys: string[];
};

export const FORM_PRIVATE_PROP_KEYS = [
  "notificationTo",
  "notificationCc",
  "notificationBcc",
  "notificationSubject",
  "notificationIntro",
  "includedSubmissionFields",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const CONTACT_FORM_FIELDS: FormFieldDefinition[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "message", label: "Message" },
];

const VOLUNTEER_FORM_FIELDS: FormFieldDefinition[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
  { key: "zipCode", label: "Zip Code" },
];

export function isFormBlockType(value: string): value is FormBlockType {
  return value === "contact-form" || value === "volunteer-form";
}

export function getFormFieldDefinitions(
  formType: FormBlockType,
): FormFieldDefinition[] {
  return formType === "contact-form"
    ? CONTACT_FORM_FIELDS
    : VOLUNTEER_FORM_FIELDS;
}

export function getDefaultIncludedFieldKeys(formType: FormBlockType): string[] {
  return getFormFieldDefinitions(formType).map((field) => field.key);
}

export function getIncludedFieldsHint(formType: FormBlockType): string {
  return getFormFieldDefinitions(formType)
    .map((field) => field.key)
    .join(", ");
}

export function normalizeEmailList(input: unknown): string[] {
  if (typeof input !== "string") {
    return [];
  }

  const seen = new Set<string>();

  return input
    .split(/[\n,;]+/)
    .map((value) => value.trim().toLowerCase())
    .filter((value) => EMAIL_PATTERN.test(value))
    .filter((value) => {
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
}

export function parseIncludedFieldKeys(
  formType: FormBlockType,
  input: unknown,
): string[] {
  const allowedKeys = new Set(
    getFormFieldDefinitions(formType).map((field) => field.key),
  );

  if (typeof input !== "string") {
    return getDefaultIncludedFieldKeys(formType);
  }

  const parsed = input
    .split(/[\n,;]+/)
    .map((value) => value.trim())
    .filter((value) => allowedKeys.has(value));

  return parsed.length > 0 ? parsed : getDefaultIncludedFieldKeys(formType);
}

export function buildDefaultFormSubject(input: {
  formType: FormBlockType;
  pageName?: string;
  formTitle?: string;
}) {
  const pageName = input.pageName?.trim();
  const formTitle = input.formTitle?.trim();
  const fallbackTitle =
    input.formType === "contact-form" ? "Contact Form" : "Volunteer Form";

  if (pageName && formTitle) {
    return `${pageName}: ${formTitle} submission`;
  }

  if (pageName) {
    return `${pageName}: ${fallbackTitle} submission`;
  }

  if (formTitle) {
    return `${formTitle} submission`;
  }

  return `${fallbackTitle} submission`;
}

export function getFormDeliveryConfig(input: {
  formType: FormBlockType;
  props: Record<string, unknown>;
  pageName?: string;
}) {
  return {
    to: normalizeEmailList(input.props.notificationTo),
    cc: normalizeEmailList(input.props.notificationCc),
    bcc: normalizeEmailList(input.props.notificationBcc),
    subject:
      typeof input.props.notificationSubject === "string" &&
      input.props.notificationSubject.trim()
        ? input.props.notificationSubject.trim()
        : buildDefaultFormSubject({
            formType: input.formType,
            pageName: input.pageName,
            formTitle:
              typeof input.props.title === "string" ? input.props.title : "",
          }),
    intro:
      typeof input.props.notificationIntro === "string"
        ? input.props.notificationIntro.trim()
        : "",
    includedFieldKeys: parseIncludedFieldKeys(
      input.formType,
      input.props.includedSubmissionFields,
    ),
  } satisfies FormDeliveryConfig;
}

function formatSubmissionValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildFormEmailText(input: {
  formType: FormBlockType;
  pageName: string;
  formTitle: string;
  intro?: string;
  includedFieldKeys: string[];
  submission: Record<string, unknown>;
}) {
  const lines: string[] = [];

  if (input.intro?.trim()) {
    lines.push(input.intro.trim(), "");
  }

  lines.push(`Page: ${input.pageName}`);
  lines.push(`Form: ${input.formTitle}`);
  lines.push(`Submitted: ${new Date().toISOString()}`);
  lines.push("");

  const labelByKey = new Map(
    getFormFieldDefinitions(input.formType).map((field) => [field.key, field.label]),
  );

  input.includedFieldKeys.forEach((fieldKey) => {
    const label = labelByKey.get(fieldKey);
    const value = formatSubmissionValue(input.submission[fieldKey]);

    if (label && value) {
      lines.push(`${label}: ${value}`);
    }
  });

  return lines.join("\n").trim();
}

export function buildFormEmailHtml(input: {
  formType: FormBlockType;
  pageName: string;
  formTitle: string;
  intro?: string;
  includedFieldKeys: string[];
  submission: Record<string, unknown>;
}) {
  const labelByKey = new Map(
    getFormFieldDefinitions(input.formType).map((field) => [field.key, field.label]),
  );

  const items = input.includedFieldKeys
    .map((fieldKey) => {
      const label = labelByKey.get(fieldKey);
      const value = formatSubmissionValue(input.submission[fieldKey]);

      if (!label || !value) {
        return "";
      }

      return `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`;
    })
    .filter(Boolean)
    .join("");

  const intro = input.intro?.trim()
    ? `<p>${escapeHtml(input.intro.trim()).replace(/\n/g, "<br />")}</p>`
    : "";

  return [
    "<div>",
    intro,
    `<p><strong>Page:</strong> ${escapeHtml(input.pageName)}</p>`,
    `<p><strong>Form:</strong> ${escapeHtml(input.formTitle)}</p>`,
    `<p><strong>Submitted:</strong> ${escapeHtml(new Date().toISOString())}</p>`,
    "<ul>",
    items,
    "</ul>",
    "</div>",
  ].join("");
}

export function stripPrivateFormSettingsFromProps(
  type: string,
  props: Record<string, unknown>,
) {
  if (!isFormBlockType(type)) {
    return props;
  }

  const nextProps = { ...props };

  FORM_PRIVATE_PROP_KEYS.forEach((key) => {
    delete nextProps[key];
  });

  return nextProps;
}

export function stripPrivateFormSettingsFromComponents(
  components: ComponentData[],
) {
  return components.map((component) => ({
    ...component,
    props: stripPrivateFormSettingsFromProps(component.type, component.props),
  }));
}
