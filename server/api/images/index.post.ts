import { fetchSentinelHubImage } from "../../utils/sentinel-hub";
import Image from "../../utils/types";
import dateSchema from "~/utils/schemas";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, dateSchema.parse);
  const { startDate, endDate } = body;

  //Check if startDate and endDate are provided
  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: "startDate and endDate are required (YYYY-MM-DD).",
    });
  }

  //Check if startDate is before endDate
  if (startDate >= endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: "startDate must be before endDate.",
    });
  }

  try {
    const { buffer } = await fetchSentinelHubImage(startDate, endDate);

    const base64String = buffer.toString("base64");
    const mimeType = "image/jpeg";

    const image: Image = await prisma.image.create({
      data: {
        data: base64String,
        mimeType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return {
      image,
      success: true,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch and store image: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
});
