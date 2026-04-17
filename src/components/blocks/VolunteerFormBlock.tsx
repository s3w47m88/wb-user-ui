"use client";

import React, { useState } from "react";
import {
  getDefaultIncludedFieldKeys,
  getIncludedFieldsHint,
} from "@/lib/form-delivery";

export type VolunteerFormBlockProps = {
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
};

type SubmissionState =
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | null;

export const VolunteerFormBlock: React.FC<VolunteerFormBlockProps> = ({
  title,
  description,
  buttonText,
  backgroundColor = "#ffffff",
  pageId,
  componentId,
  submissionEnabled = true,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zipCode: "",
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
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        zipCode: "",
      });
      setSubmissionState({
        status: "success",
        message:
          result?.message || "Thank you for volunteering. We will be in touch.",
      });
    } catch (error) {
      console.error("Volunteer form submit failed:", error);
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
        <h2 className="text-4xl font-bold text-center mb-4">{title}</h2>
        <p className="text-center text-gray-600 mb-8">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                required
                value={formData.firstName}
                onChange={(event) => {
                  setFormData({ ...formData, firstName: event.target.value });
                  setSubmissionState(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                required
                value={formData.lastName}
                onChange={(event) => {
                  setFormData({ ...formData, lastName: event.target.value });
                  setSubmissionState(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(event) => {
                  setFormData({ ...formData, phone: event.target.value });
                  setSubmissionState(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(event) => {
                  setFormData({ ...formData, zipCode: event.target.value });
                  setSubmissionState(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
            className="w-full px-6 py-4 bg-red-600 text-white rounded-lg transition-colors font-semibold text-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export const volunteerFormBlockConfig = {
  type: "volunteer-form",
  name: "Volunteer Form",
  category: "components",
  thumbnail:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZjI5MzciIHRleHQtYW5jaG9yPSJtaWRkbGUiPlZvbHVudGVlciBGb3JtPC90ZXh0PjxyZWN0IHg9IjQwIiB5PSI0NSIgd2lkdGg9IjExMCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjE3MCIgeT0iNDUiIHdpZHRoPSIxMTAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI0MCIgeT0iNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI0MCIgeT0iOTUiIHdpZHRoPSIxMTAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI5MCIgeT0iMTI1IiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjI1IiByeD0iNiIgZmlsbD0iI2RjMjYyNiIvPjwvc3ZnPg==",
  defaultProps: {
    title: "Join Our Team",
    description:
      "Help us make a difference. Sign up to volunteer for our campaign.",
    buttonText: "Sign Me Up",
    backgroundColor: "#ffffff",
    notificationTo: "",
    notificationCc: "",
    notificationBcc: "",
    notificationSubject: "",
    notificationIntro: "",
    includedSubmissionFields: getDefaultIncludedFieldKeys(
      "volunteer-form",
    ).join(", "),
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
      placeholder: "New volunteer form submission",
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
      placeholder: getIncludedFieldsHint("volunteer-form"),
      description: `Available keys: ${getIncludedFieldsHint("volunteer-form")}. Separate with commas.`,
    },
  },
};
