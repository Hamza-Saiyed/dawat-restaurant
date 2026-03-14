// Email service — branded HTML email templates for Dawat Restaurant

import { sendMail, emailDefaults } from '@/lib/mailer';
import { logger } from '@/lib/logger';
import { IReservation } from '@/models/Reservation';
import { formatDateForEmail } from '@/backend/utils/dateUtils';
import { RESTAURANT } from '@/backend/config/constants';

export class EmailService {
  /**
   * Send reservation confirmation to customer.
   */
  static async sendReservationConfirmation(reservation: IReservation): Promise<void> {
    if (!reservation.email) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; background: #f9f5f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #0A0A0A; padding: 40px; text-align: center; }
    .header h1 { color: #C9A84C; font-size: 36px; margin: 0; letter-spacing: 4px; }
    .header p { color: #B8A898; margin: 8px 0 0; }
    .body { padding: 40px; }
    .booking-card { background: #f9f5f0; border-left: 4px solid #C9A84C; padding: 24px; margin: 24px 0; border-radius: 4px; }
    .booking-row { margin: 8px 0; }
    .label { color: #6B5E4E; font-size: 14px; }
    .value { color: #1A1A1A; font-weight: bold; }
    .confirmation-id { text-align: center; font-size: 24px; color: #C9A84C; font-weight: bold; letter-spacing: 2px; margin: 24px 0; }
    .footer { background: #0A0A0A; padding: 24px; text-align: center; color: #6B5E4E; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DAWAT</h1>
      <p>Authentic North Indian Cuisine</p>
    </div>
    <div class="body">
      <h2>Reservation Received! 🎉</h2>
      <p>Dear ${reservation.name},</p>
      <p>Your reservation request at <strong>Dawat Restaurant</strong> has been received. We'll confirm your booking shortly.</p>
      <div class="confirmation-id">${reservation.confirmationId}</div>
      <div class="booking-card">
        <div class="booking-row"><span class="label">📅 Date: </span><span class="value">${formatDateForEmail(reservation.date)}</span></div>
        <div class="booking-row"><span class="label">⏰ Time: </span><span class="value">${reservation.time}</span></div>
        <div class="booking-row"><span class="label">👥 Guests: </span><span class="value">${reservation.guests} ${reservation.guests === 1 ? 'Guest' : 'Guests'}</span></div>
        ${reservation.occasion ? `<div class="booking-row"><span class="label">🎊 Occasion: </span><span class="value">${reservation.occasion}</span></div>` : ''}
      </div>
      <p><strong>📍 Location:</strong> ${RESTAURANT.address}</p>
      <p><strong>📞 Phone:</strong> ${RESTAURANT.phone}</p>
      <p style="color: #6B5E4E; font-size: 14px;">To modify or cancel your reservation, please call us at least 2 hours before your booking time.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Dawat Restaurant. All Rights Reserved.</p>
      <p>Vishala Circle, Ahmedabad | ${RESTAURANT.phone}</p>
    </div>
  </div>
</body>
</html>`;

    await sendMail({
      to: reservation.email,
      subject: `Reservation Received - ${reservation.confirmationId} | Dawat Restaurant`,
      html,
    });
  }

  /**
   * Send reservation approval email to customer.
   */
  static async sendReservationApproval(reservation: IReservation): Promise<void> {
    if (!reservation.email) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; background: #f9f5f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #0A0A0A; padding: 40px; text-align: center; }
    .header h1 { color: #C9A84C; font-size: 36px; margin: 0; letter-spacing: 4px; }
    .header p { color: #B8A898; margin: 8px 0 0; }
    .body { padding: 40px; }
    .booking-card { background: #f0f9f0; border-left: 4px solid #22c55e; padding: 24px; margin: 24px 0; border-radius: 4px; }
    .booking-row { margin: 8px 0; }
    .label { color: #6B5E4E; font-size: 14px; }
    .value { color: #1A1A1A; font-weight: bold; }
    .confirmed-badge { text-align: center; font-size: 20px; color: #22c55e; font-weight: bold; margin: 24px 0; padding: 16px; border: 2px solid #22c55e; border-radius: 8px; }
    .footer { background: #0A0A0A; padding: 24px; text-align: center; color: #6B5E4E; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DAWAT</h1>
      <p>Authentic North Indian Cuisine</p>
    </div>
    <div class="body">
      <h2>Your Table is Confirmed! ✅</h2>
      <p>Dear ${reservation.name},</p>
      <p>Great news! Your reservation at <strong>Dawat Restaurant</strong> has been confirmed.</p>
      <div class="confirmed-badge">CONFIRMED — ${reservation.confirmationId}</div>
      <div class="booking-card">
        <div class="booking-row"><span class="label">📅 Date: </span><span class="value">${formatDateForEmail(reservation.date)}</span></div>
        <div class="booking-row"><span class="label">⏰ Time: </span><span class="value">${reservation.time}</span></div>
        <div class="booking-row"><span class="label">👥 Guests: </span><span class="value">${reservation.guests} ${reservation.guests === 1 ? 'Guest' : 'Guests'}</span></div>
      </div>
      <p>We look forward to serving you! 🍽️</p>
      <p><strong>📍 Location:</strong> ${RESTAURANT.address}</p>
      <p><a href="${RESTAURANT.googleMapsUrl}" style="color: #C9A84C;">View on Google Maps →</a></p>
      <p><strong>📞 Phone:</strong> ${RESTAURANT.phone}</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Dawat Restaurant. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>`;

    await sendMail({
      to: reservation.email,
      subject: `Table Confirmed! - ${reservation.confirmationId} | Dawat Restaurant`,
      html,
    });
  }

  /**
   * Notify restaurant owner about new booking.
   */
  static async sendNewBookingNotification(reservation: IReservation): Promise<void> {
    const restaurantEmail = emailDefaults.restaurantEmail;
    if (!restaurantEmail) return;

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #C9A84C;">New Reservation 📩</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px; color: #666;">Name</td><td style="padding: 8px; font-weight: bold;">${reservation.name}</td></tr>
    <tr style="background: #f9f9f9;"><td style="padding: 8px; color: #666;">Phone</td><td style="padding: 8px; font-weight: bold;">${reservation.phone}</td></tr>
    <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px; font-weight: bold;">${formatDateForEmail(reservation.date)}</td></tr>
    <tr style="background: #f9f9f9;"><td style="padding: 8px; color: #666;">Time</td><td style="padding: 8px; font-weight: bold;">${reservation.time}</td></tr>
    <tr><td style="padding: 8px; color: #666;">Guests</td><td style="padding: 8px; font-weight: bold;">${reservation.guests}</td></tr>
    ${reservation.occasion ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; color: #666;">Occasion</td><td style="padding: 8px; font-weight: bold;">${reservation.occasion}</td></tr>` : ''}
    ${reservation.specialRequests ? `<tr><td style="padding: 8px; color: #666;">Requests</td><td style="padding: 8px;">${reservation.specialRequests}</td></tr>` : ''}
  </table>
  <p style="margin-top: 20px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/reservations" style="background: #C9A84C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">View in Admin Panel →</a></p>
</div>`;

    await sendMail({
      to: restaurantEmail,
      subject: `New Reservation: ${reservation.name} (${reservation.guests} guests) - ${reservation.time}`,
      html,
    });
  }
}
