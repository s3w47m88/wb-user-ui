"use client";

import React, { useState } from "react";
import { ThemeConfig } from "@/lib/supabase-content";
import {
  getIncludedFieldsHint,
  getDefaultIncludedFieldKeys,
} from "@/lib/form-delivery";
import { useEditorStore } from "@/store/editor-store";

export type ContactFormBlockProps = {
  title: string;
  description: string;
  buttonText: string;
  backgroundColor?: string;
  notificationTo?: string;
  notificationCc?: string;
  notificationBcc?: string;
  notificationSubject?: string;
  notificationIntro?: string;
  includedSubmissionFields?: string;
  pageId?: string;
  componentId?: string;
  submissionEnabled?: boolean;
  themeOverride?: ThemeConfig;
};

type SubmissionState =
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | null;

export const ContactFormBlock: React.FC<ContactFormBlockProps> = ({
  title,
  description,
  buttonText,
  backgroundColor = "#ffffff",
  pageId,
  componentId,
  submissionEnabled = true,
  themeOverride,
}) => {
  const editorTheme = useEditorStore((state) => state.theme);
  const theme = themeOverride ?? editorTheme;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!submissionEnabled) {
      setSubmissionState({
        status: "error",
        message: "Open preview to test form delivery.",
      });
      return;
    }

    if (!pageId || !componentId) {
      setSubmissionState({
        status: "error",
        message: "Form delivery context is missing.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionState(null);

    try {
      const response = await fetch("/api/form-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId,
          componentId,
          formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmissionState({
          status: "error",
          message: result?.message || "Failed to submit the form.",
        });
        return;
      }

      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setSubmissionState({
        status: "success",
        message:
          result?.message || "Thank you for your message. We will be in touch.",
      });
    } catch (error) {
      console.error("Contact form submit failed:", error);
      setSubmissionState({
        status: "error",
        message: "Failed to submit the form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 px-6" style={{ backgroundColor }}>
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-4xl font-bold text-center mb-4"
          style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
        >
          {title}
        </h2>
        <p
          className="text-center text-gray-600 mb-8"
          style={{ fontFamily: theme.fonts.body, color: theme.colors.text }}
        >
          {description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(event) => {
                setFormData({ ...formData, name: event.target.value });
                setSubmissionState(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: theme.fonts.body }}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(event) => {
                setFormData({ ...formData, email: event.target.value });
                setSubmissionState(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: theme.fonts.body }}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message *
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(event) => {
                setFormData({ ...formData, message: event.target.value });
                setSubmissionState(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: theme.fonts.body }}
            />
          </div>

          {submissionState && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                submissionState.status === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {submissionState.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 text-white rounded-lg transition-colors font-semibold text-lg disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: theme.colors.primary,
              fontFamily: theme.fonts.body,
            }}
          >
            {isSubmitting ? "Sending..." : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export const contactFormBlockConfig = {
  type: "contact-form",
  name: "Contact Form",
  category: "components",
  thumbnail:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZjI5MzciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbnRhY3QgRm9ybTwvdGV4dD48cmVjdCB4PSI0MCIgeT0iNDUiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI0MCIgeT0iNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI0MCIgeT0iOTUiIHdpZHRoPSIyNDAiIGhlaWdodD0iMzUiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI5MCIgeT0iMTQwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjI1IiByeD0iNiIgZmlsbD0iIzNiODJmNiIvPjwvc3ZnPg==",
  defaultProps: {
    title: "Get In Touch",
    description:
      "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    buttonText: "Send Message",
    backgroundColor: "#ffffff",
    notificationTo: "",
    notificationCc: "",
    notificationBcc: "",
    notificationSubject: "",
    notificationIntro: "",
    includedSubmissionFields: getDefaultIncludedFieldKeys("contact-form").join(
      ", ",
    ),
  },
  propsSchema: {
    title: { type: "text", label: "Title" },
    description: { type: "text", label: "Description" },
    buttonText: { type: "text", label: "Button Text" },
    backgroundColor: { type: "color", label: "Background Color" },
    notificationTo: {
      type: "text",
      label: "Send To",
      placeholder: "campaign@example.com",
      description: "Primary recipient emails. Separate multiple addresses with commas.",
    },
    notificationCc: {
      type: "text",
      label: "CC",
      placeholder: "team@example.com",
      description: "Optional CC recipients, comma-separated.",
    },
    notificationBcc: {
      type: "text",
      label: "BCC",
      placeholder: "archive@example.com",
      description: "Optional BCC recipients, comma-separated.",
    },
    notificationSubject: {
      type: "text",
      label: "Email Subject",
      placeholder: "New contact form submission",
      description: "Leave blank to use the default subject built from page and form title.",
    },
    notificationIntro: {
      type: "textarea",
      label: "Email Intro",
      placeholder: "Optional note above the submitted fields.",
      description: "Optional plain-text intro shown at the top of the email.",
    },
    includedSubmissionFields: {
      type: "text",
      label: "Included Fields",
      placeholder: getIncludedFieldsHint("contact-form"),
      description: `Available keys: ${getIncludedFieldsHint("contact-form")}. Separate with commas.`,
    },
  },
};
