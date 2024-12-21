import { useEffect, useState } from 'react';
import { useCreateScan, useScans, useUpdateScanPosition } from '../hooks/useScan';
import { animated, useSpring } from '@react-spring/web';
import { Box, Button, CircularProgress, Grid2 } from '@mui/material';
import DomainScanModal from "../components/DomainScanModal.tsx";
import ScanCard from "../components/ScanCard.tsx";
import { Scan } from "../types/Scan";
import useWebSocket from "react-use-websocket";
import { useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const queryClient = useQueryClient();
  const [showScanButton, setShowScanButton] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { data: scans, isLoading: isScansLoading } = useScans();
  const { mutate: createScan, isPending: isCreateScanPending } = useCreateScan();
  const { lastMessage } = useWebSocket("http://localhost:8080/amass-scan");

  const [sortedScans, setSortedScans] = useState<Scan[]>([]);

  useEffect(() => {
    if (lastMessage) {
      console.log("Scan object updated values:", lastMessage);

      void queryClient.invalidateQueries({ queryKey: ['scans'] });
    }
  }, [lastMessage, queryClient]);

  useEffect(() => {
    if (scans && !isScansLoading) {
      setSortedScans(scans.sort((scanA, scanB) => scanA.position! - scanB.position!));
    }
  }, [scans, isScansLoading]);

  const updateScanPosition = useUpdateScanPosition();

  const handleScanSubmit = async (domain: string) => {
    createScan({ domain });
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const buttonStyle = useSpring({
    opacity: showScanButton ? 1 : 0,
    transform: showScanButton ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 120, friction: 14 },
  });

  const gridStyle = useSpring({
    marginTop: showScanButton ? 150 : 0,
    opacity: showScanButton ? 0.5 : 1,
    config: { tension: 120, friction: 20 },
  });

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setShowScanButton(scrollTop < 100);
  };

  const handleDragEnd = (id: number, newPosition: number, oldPosition: number) => {
    const grabbedScan = sortedScans[oldPosition - 1];
    const updatedSortedScans = [...sortedScans];
    updatedSortedScans.splice(oldPosition - 1, 1)
    updatedSortedScans.splice(newPosition - 1, 0, grabbedScan)
    setSortedScans(updatedSortedScans);
    updateScanPosition.mutate({ id, newPosition });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <animated.div style={buttonStyle}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              width: 200,
              height: 70,
              fontSize: '1.2rem',
              borderRadius: '10px',
              boxShadow: 3,
            }}
            onClick={handleOpenModal}
            disabled={isCreateScanPending}
          >
            {isCreateScanPending ? <CircularProgress/> : "Scan Domain"}
          </Button>
        </Box>
      </animated.div>

      <DomainScanModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleScanSubmit}
      />

      <animated.div style={gridStyle}>
        <Grid2 container spacing={4} sx={{ minHeight: "calc(100vh - 40px)", px: 5, pb: 5 }}>
          {isScansLoading ? (
            <CircularProgress/>
          ) : (
            sortedScans?.map((scan) => (
              <Grid2 key={scan.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ScanCard
                  scan={scan}
                  onDragEnd={handleDragEnd}
                />
              </Grid2>
            ))
          )}
        </Grid2>
      </animated.div>
    </Box>
  );
};

export default Home;
