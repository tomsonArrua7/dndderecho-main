import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingBar } from "./LoadingBar";
import { useApp } from "@/context/AppContext";

export const Layout = () => {
  const location = useLocation();
  const { isFocusMode } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30">
      <LoadingBar />
      
      {!isFocusMode && <Navbar />}
      
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!isFocusMode && <Footer />}
    </div>
  );
};
