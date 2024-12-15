import apiClient from "./apiClient.ts";
import { Scan } from "../types/Scan";

export const fetchScans: () => Promise<Scan[]> = async () => {
  return await apiClient.get('/scans');
};

export const fetchScanById: ({ id }: { id: number }) => Promise<Scan> = async ({ id }) => {
  return await apiClient.get(`/scan/${id}`);
};

export const createScan: ({ domain }: { domain: string }) => Promise<Scan> = async ({ domain }) => {
  return await apiClient.post('/scan', { domain });
};

export const updateScanPosition: ({ id, newPosition }: {
  id: number,
  newPosition: number
}) => Promise<void> = async ({ id, newPosition }) => {
  return await apiClient.patch(`/scan/${id}/position`, { newPosition });
};