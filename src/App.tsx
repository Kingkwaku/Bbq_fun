import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Share from "./pages/Share";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/share" element={<Share />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Toaster
        position="top-center"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: "rgba(20,24,31,0.92)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </>
  );
}
