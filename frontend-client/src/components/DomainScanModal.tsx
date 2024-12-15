import React, { useState } from "react";
import { Button, Grid2, TextField, Typography, } from "@mui/material";
import DefaultModal from "./DefaultModal.tsx";

type DomainScanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (domain: string) => void;
};

const DomainScanModal = ({
                           isOpen,
                           onClose,
                           onSubmit,
                         }: DomainScanModalProps) => {
  const [domain, setDomain] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onSubmit(domain.trim());
      setDomain("");
    }
  };

  return (
    <DefaultModal isOpen={isOpen} onClose={onClose}>
      <Typography variant="h6" mb={2}>
        Start a New Scan
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          fullWidth
          label="Domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
          margin="normal"
        />
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={{ xs: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setDomain("");
                onClose();
              }}
            >
              Cancel
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Button fullWidth type="submit" variant="contained">
              Scan
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </DefaultModal>
  );
};

export default DomainScanModal;