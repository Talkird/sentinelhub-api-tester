import { fetchSentinelHubImage } from "../utils/sentinel-hub";
import Image from "../utils/types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { startDate, endDate } = body;

  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: "startDate and endDate are required (YYYY-MM-DD).",
    });
  }

  try {
    const { buffer } = await fetchSentinelHubImage(startDate, endDate);

    const base64String = buffer.toString("base64");
    const filename = `sentinel-hub-${startDate}-to-${endDate}.jpg`;
    const mimeType = "image/jpeg";

    const image = await prisma.image.create({
      data: {
        data: base64String,
        mimeType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch and store image: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
});
