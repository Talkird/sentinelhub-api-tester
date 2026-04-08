import Image from "../utils/types";

export default defineEventHandler(async (event) => {
  try {
    const images = await prisma.image.findMany();

    return images;
  } catch (error) {
    console.error("Error reading images:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read images.",
    });
  }
});
