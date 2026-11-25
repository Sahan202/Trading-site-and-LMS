const { loadEnvConfig } = require('@next/env');
const nodemailer = require('nodemailer');

loadEnvConfig(process.cwd(), false, { info() {}, error() {} });

async function main() {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Missing settings: ${missing.join(', ')}. Set them in .env.local before checking.`);
  }
  const port = Number(process.env.SMTP_PORT || 465);
  if (![465, 587].includes(port)) {
    throw new Error('Use your provider\'s TLS SMTP port: 465 or 587.');
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST.trim(),
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    logger: false,
    debug: false,
  });
  try {
    await transport.verify();
    console.log('SMTP connection and authentication passed. No email was sent. Sender verification and delivery still need a real application test.');
  } catch (error) {
    const code = typeof error.code === 'string' ? error.code : 'UNKNOWN';
    const explanations = {
      EAUTH: 'SMTP authentication failed. Check the provider username and app password/API key.',
      EDNS: 'SMTP hostname could not be resolved.',
      ECONNECTION: 'SMTP connection failed. Check hostname and port.',
      ETIMEDOUT: 'SMTP connection timed out. Check provider connectivity and port.',
      ESOCKET: 'SMTP TLS/socket connection failed. Check the provider TLS settings.',
    };
    throw new Error(explanations[code] || 'SMTP verification failed. Check provider settings.');
  } finally {
    transport.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
