export default interface Image {
  id: number;
  data: string;
  mimeType: string;
  createdAt: Date | string;
  startDate: Date | string;
  endDate: Date | string;
}
