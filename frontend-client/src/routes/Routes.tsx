import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ScanDetails from "../pages/ScanDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/scans/:id" element={<ScanDetails sx={{ px: 4, maxWidth: 600, margin: "auto" }}/>}/>
    </Routes>
  );
};

export default AppRoutes;