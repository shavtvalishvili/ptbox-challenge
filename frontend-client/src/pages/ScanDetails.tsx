import { useParams } from "react-router-dom";
import { Box, CircularProgress, Grid2, SxProps, Typography } from "@mui/material";
import { useScanById } from "../hooks/useScan.ts";
import { ReactNode } from "react";

type ScanDetailsProps = {
  scanId?: number;
  sx?: SxProps;
}

const ScanDetails = ({ scanId: scanIdFromProps, sx }: ScanDetailsProps) => {
  const { id: scanIdFromUrl } = useParams<{ id: string }>();
  const { data: scan, isLoading, isError } = useScanById(scanIdFromUrl ? Number(scanIdFromUrl) : scanIdFromProps!);

  if (isLoading) {
    return (
      <Box sx={sx}>
        <CircularProgress/>
      </Box>
    );
  }

  if (isError || !scan) {
    return (
      <Box sx={{ textAlign: "center", ...sx }}>
        <Typography variant="h4" color="error">
          Scan not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <Row
        label={<Typography variant="h6">Domain:</Typography>}
        value={<Typography variant="h6">{scan.domain}</Typography>}
        sx={{ marginBottom: 1 }}
      />
      <Row
        label={<Typography>ID:</Typography>}
        value={<Typography>{scan.id}</Typography>}
      />
      <ScanTime
        label="Start Time:"
        time={new Date(scan.startTime).toLocaleString()}
      />
      <ScanTime
        label="End Time:"
        time={scan.endTime ? new Date(scan.endTime).toLocaleString() : "Scan in progress"}
      />
      <Row
        label={<Typography>Status:</Typography>}
        value={
          <Typography
            color={scan.status === "Completed" ? "success" : "error"}
          >
            {scan.status}
          </Typography>
        }
      />
      <Box>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Scan Results:
        </Typography>
        {scan.results ? (
          <Grid2 container direction="column" spacing={1} mt={1}>
            {scan.results.split('\n').map(((item, index) => (
              <Grid2
                key={index}
                size={{ xs: 12 }}
                bgcolor={index % 2 ? '#f5f5f5' : 'transparent'}
              >
                {item}
              </Grid2>
            )))}
          </Grid2>
        ) : (
          <Typography>Scan in progress</Typography>
        )}
      </Box>
    </Box>
  );
};

const ScanTime = ({ label, time }: { label: string, time: string }) => (
  <Row
    label={
      <Typography variant="body1">
        {label}
      </Typography>
    }
    value={
      <Typography variant="body1" color="info">
        {time}
      </Typography>
    }
  />
);

const Row = ({ label, value, sx }: { label: ReactNode, value: ReactNode, sx?: SxProps }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", ...sx }}>
    {label}
    {value}
  </Box>
);

export default ScanDetails;