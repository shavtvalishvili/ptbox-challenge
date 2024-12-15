import { useParams } from "react-router-dom";
import { Box, CircularProgress, SxProps, Typography } from "@mui/material";
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
          <>
            {scan.results.split(" --> ").map((line, index) => (
              <Typography
                key={index}
                fontStyle={index % 2 ? "italic" : "normal"}
                color={index % 2 ? "textSecondary" : "textPrimary"}
              >
                {line}
              </Typography>
            ))}
          </>
        ) : (
          <Typography>No subdomains found for this scan.</Typography>
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