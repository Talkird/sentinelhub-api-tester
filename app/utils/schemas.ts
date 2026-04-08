import { z } from "zod";

const dateSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD")
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),

    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD")
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export default dateSchema;
