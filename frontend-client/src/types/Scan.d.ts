export type Scan = {
  id?: number;
  domain: string;
  startTime: string;
  endTime: string | null;
  status: "Completed" | "Failed";
  results?: string;
  position?: number;
};
