import { Box, Link, Typography, } from "@mui/material";
import ScanDetails from "../pages/ScanDetails.tsx"
import DefaultModal from "./DefaultModal.tsx";

type ScanDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scanId: number;
};

const ScanDetailsModal = ({
                            isOpen,
                            onClose,
                            scanId,
                          }: ScanDetailsModalProps) => {
  return (
    <DefaultModal isOpen={isOpen} onClose={onClose} sx={{ width: 600 }}>
      <Typography variant="h6" mb={2}>
        Scan Details
      </Typography>
      <ScanDetails scanId={scanId}></ScanDetails>
      <Box mt={2}>
        <Link href={`/scans/${scanId}`} target="_blank">Open in new tab</Link>
      </Box>
    </DefaultModal>
  );
};

export default ScanDetailsModal;