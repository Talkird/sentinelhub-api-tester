import { fetchSentinelHubImage } from "../../utils/sentinel-hub";
import Image from "../../utils/types";
import { saveImageSchema } from "~/utils/schemas";
import boundingBoxes from "~/utils/bounding-boxes";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, saveImageSchema.parse);
  const { startDate, endDate, region } = body;

  const boundingBox: number[] =
    boundingBoxes[region as keyof typeof boundingBoxes];

  try {
    const { buffer } = await fetchSentinelHubImage(
      startDate,
      endDate,
      boundingBox,
    );

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
