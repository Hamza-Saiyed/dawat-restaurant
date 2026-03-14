// Nodemailer email sending utility

import nodemailer from 'nodemailer';
import { emailConfig, emailDefaults, isEmailConfigured } from '@/backend/config/email.config';
import { logger } from './logger';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!isEmailConfigured()) {
    logger.warn('Email not configured — SMTP_USER and SMTP_PASS required');
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);
  }

  return transporter;
}

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email via the configured SMTP transporter.
 * Silently fails if email is not configured (logs a warning).
 */
export async function sendMail(options: SendMailOptions): Promise<boolean> {
  const transport = getTransporter();

  if (!transport) {
    logger.warn('Email not sent — transporter not configured', {
      to: options.to,
      subject: options.subject,
    });
    return false;
  }

  try {
    await transport.sendMail({
      from: options.from || emailDefaults.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    logger.info('Email sent successfully', {
      to: options.to,
      subject: options.subject,
    });
    return true;
  } catch (error) {
    logger.error('Failed to send email', {
      to: options.to,
      subject: options.subject,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
}

export { emailDefaults };
