import React, { useState } from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import ScanDetailsModal from './ScanDetailsModal';
import { Scan } from "../types/Scan";
import { useScans } from "../hooks/useScan.ts";

type ScanCardProps = {
  scan: Scan,
  onDragEnd: (id: number, newPosition: number, oldPosition: number) => void;
};

const ScanCard = ({ scan, onDragEnd }: ScanCardProps) => {
  const { data: scans } = useScans();
  const [isDragging, setIsDragging] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { id, domain, startTime, endTime, status, position } = scan;

  const dragStyle = useSpring({
    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    config: { tension: 220, friction: 12 },
  });

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    const { clientX, clientY } = e;
    const element = document.elementFromPoint(clientX, clientY);
    let newPosition: number | undefined;
    console.log("Current position", position);

    if (element) {
      const scanCardElement = element.closest<HTMLDivElement>(".scan-card");

      if (scanCardElement) {
        const targetScanId = scanCardElement.getAttribute("id");
        console.log(scans);
        const targetScan = scans?.find((scan) => scan.id === Number(targetScanId));
        newPosition = targetScan?.position;
        console.log(`Drag ended over ScanCard with ID: ${targetScanId}, ${newPosition}`);
      } else {
        console.log("Drag ended, but no ScanCard found under the pointer.");
      }
    } else {
      console.log("No element found under the pointer.");
    }

    if (newPosition && newPosition !== position) {
      onDragEnd(id!, newPosition, position!);
    }
  };

  return (
    <animated.div
      style={dragStyle}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <Card
        id={`${id}`}
        className="scan-card"
        sx={{
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="caption" sx={{ alignSelf: 'flex-end', color: 'gray' }}>
          #{id}
        </Typography>
        <Typography variant="h6">{domain}</Typography>
        <Box>
          <Typography variant="body2">{`Started: ${new Date(startTime).toLocaleString()}`}</Typography>
          <Typography
            variant="body2">{`Ended: ${endTime ? new Date(endTime).toLocaleString() : "Scan in progress"}`}
          </Typography>
          <Typography
            mt={1}
            variant="body2"
            color={status === "Completed" ? "success" : "error"}
          >
            {status}
          </Typography>
        </Box>
        <Button variant="text" onClick={() => setOpenModal(true)}>
          View Details
        </Button>
        <ScanDetailsModal isOpen={openModal} onClose={() => setOpenModal(false)} scanId={id!}/>
      </Card>
    </animated.div>
  );
};

export default ScanCard;