export default defineEventHandler(async (event) => {
  const id = getRouterParams(event).id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image ID is required.",
    });
  }

  const parsedId = parseInt(id);

  const deletedImage = await prisma.image.delete({
    where: { id: parsedId },
  });

  return {
    deletedImage,
  };
});
