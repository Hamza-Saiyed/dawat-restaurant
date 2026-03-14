import * as z from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  guests: z.coerce.number().min(1, "Minimum 1 guest").max(20, "Maximum 20 guests"),
  date: z.string().refine((val) => {
    const selectedDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Date must be today or in the future"),
  time: z.string().min(1, "Please select a time slot").regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format"),
  occasion: z.enum(["Birthday", "Anniversary", "Business Dinner", "Family Gathering", "Date Night", "Other", ""]).optional(),
  specialRequests: z.string().max(500, "Maximum 500 characters").optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
