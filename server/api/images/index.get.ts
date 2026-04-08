import Image from "../../utils/types";

export default defineEventHandler(async (event) => {
  const images: Image[] = await prisma.image.findMany();
  return images;
});
