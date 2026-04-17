import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { mapLegacyPageToPageConfig } from "@/lib/builder-pages";
import {
  buildFormEmailHtml,
  buildFormEmailText,
  getFormDeliveryConfig,
  isFormBlockType,
  normalizeEmailList,
} from "@/lib/form-delivery";
import {
  getContentAdminClient,
  loadLegacyPageAndSite,
} from "@/app/api/pages/helpers";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number.parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL;
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME;

function isMailerConfigured() {
  return Boolean(
    SMTP_HOST &&
      Number.isFinite(SMTP_PORT) &&
      SMTP_FROM_EMAIL &&
      SMTP_USER &&
      SMTP_PASSWORD,
  );
}

function getTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth:
      SMTP_USER && SMTP_PASSWORD
        ? {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
          }
        : undefined,
  });
}

function buildFromAddress() {
  if (!SMTP_FROM_EMAIL) {
    return "";
  }

  if (SMTP_FROM_NAME?.trim()) {
    return `${SMTP_FROM_NAME.trim()} <${SMTP_FROM_EMAIL}>`;
  }

  return SMTP_FROM_EMAIL;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pageId =
      typeof body?.pageId === "string" ? body.pageId.trim() : undefined;
    const componentId =
      typeof body?.componentId === "string" ? body.componentId.trim() : undefined;
    const formData =
      body?.formData && typeof body.formData === "object" ? body.formData : null;

    if (!pageId || !componentId || !formData) {
      return NextResponse.json(
        { message: "Missing required form submission fields." },
        { status: 400 },
      );
    }

    const adminClient = getContentAdminClient();
    const { page, site } = await loadLegacyPageAndSite(adminClient, pageId);

    if (!page) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const builderPage = mapLegacyPageToPageConfig(page, site);

    if (!builderPage) {
      return NextResponse.json({ message: "Page not found." }, { status: 404 });
    }

    const component = builderPage.components.find((item) => item.id === componentId);

    if (!component || !isFormBlockType(component.type)) {
      return NextResponse.json(
        { message: "Form component not found." },
        { status: 404 },
      );
    }

    const delivery = getFormDeliveryConfig({
      formType: component.type,
      props: component.props,
      pageName: builderPage.name,
    });

    if (delivery.to.length === 0) {
      return NextResponse.json(
        { message: "Form recipients are not configured yet." },
        { status: 400 },
      );
    }

    if (!isMailerConfigured()) {
      return NextResponse.json(
        { message: "Email delivery is not configured on the server." },
        { status: 503 },
      );
    }

    const replyTo = normalizeEmailList(formData.email).at(0);
    const formTitle =
      typeof component.props.title === "string" && component.props.title.trim()
        ? component.props.title.trim()
        : component.type === "contact-form"
          ? "Contact Form"
          : "Volunteer Form";
    const text = buildFormEmailText({
      formType: component.type,
      pageName: builderPage.name,
      formTitle,
      intro: delivery.intro,
      includedFieldKeys: delivery.includedFieldKeys,
      submission: formData as Record<string, unknown>,
    });
    const html = buildFormEmailHtml({
      formType: component.type,
      pageName: builderPage.name,
      formTitle,
      intro: delivery.intro,
      includedFieldKeys: delivery.includedFieldKeys,
      submission: formData as Record<string, unknown>,
    });

    const transporter = getTransporter();
    await transporter.sendMail({
      from: buildFromAddress(),
      to: delivery.to.join(", "),
      cc: delivery.cc.length > 0 ? delivery.cc.join(", ") : undefined,
      bcc: delivery.bcc.length > 0 ? delivery.bcc.join(", ") : undefined,
      subject: delivery.subject,
      text,
      html,
      replyTo,
    });

    return NextResponse.json({
      success: true,
      message:
        component.type === "contact-form"
          ? "Thank you for your message. We will be in touch."
          : "Thank you for volunteering. We will be in touch.",
    });
  } catch (error: unknown) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to submit the form.",
      },
      { status: 500 },
    );
  }
}
