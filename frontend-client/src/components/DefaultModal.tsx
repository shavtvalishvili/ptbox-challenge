import { Box, Modal, SxProps, } from "@mui/material";
import { ReactNode } from "react";

type DefaultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sx?: SxProps;
  children: ReactNode;
};

const DefaultModal = ({
                        isOpen,
                        onClose,
                        sx,
                        children
                      }: DefaultModalProps) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          ...sx
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default DefaultModal;