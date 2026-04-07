import fs from "fs";
import path from "path";
import { fetchSentinelHubImage, trainingDataDir } from "../utils/sentinel-hub";
import { Image } from "../types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const startDate = body?.startDate;
  const endDate = body?.endDate;

  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: "startDate and endDate are required (YYYY-MM-DD).",
    });
  }

  const { buffer, timestamp } = await fetchSentinelHubImage(startDate, endDate);

  const filename = `sentinel-hub-${timestamp}.jpg`;
  const filepath = path.join(trainingDataDir, filename);

  fs.writeFileSync(filepath, buffer);
  const stats = fs.statSync(filepath);

  const image: Image = {
    filename,
    size: stats.size,
    url: `/training_data/${filename}`,
    date: new Date(stats.mtime).toLocaleString(),
  };

  return {
    image,
  };
});
