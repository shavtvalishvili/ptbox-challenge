import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createScan, fetchScanById, fetchScans, updateScanPosition } from '../api/scanService.ts';

export const useScans = () => {
  return useQuery({
    queryKey: ['scans'],
    queryFn: fetchScans,
  })
};

export const useScanById = (id: number) => {
  return useQuery({
    queryKey: ['scan', id],
    queryFn: () => fetchScanById({ id }),
  })
};

export const useCreateScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createScan,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scans'] })
    },
  })
};

export const useUpdateScanPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateScanPosition,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['scans'] })
    },
  });
};