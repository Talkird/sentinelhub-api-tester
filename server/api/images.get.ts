import fs from "fs";
import path from "path";
import { trainingDataDir } from "../utils/sentinel-hub";
import { Image } from "../types";

export default defineEventHandler((event) => {
  try {
    const files = fs
      .readdirSync(trainingDataDir)
      .filter((file) => file.toLowerCase().endsWith(".jpg"))
      .sort();

    const images: Image[] = files.map((file) => {
      const filepath = path.join(trainingDataDir, file);
      const stats = fs.statSync(filepath);
      return {
        id: file,
        filename: file,
        url: `/training_data/${file}`,
        size: stats.size,
        date: new Date(stats.mtime).toLocaleString(),
      };
    }); 

    return {
      images,
    };
  } catch (error) {
    console.error("Error reading images:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read images.",
    });
  }
});
