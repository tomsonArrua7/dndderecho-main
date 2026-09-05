import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingBar } from "./LoadingBar";
import { useApp } from "@/context/AppContext";
import { CommunityButton } from "./CommunityButton";

export const Layout = () => {
  const location = useLocation();
  const { isFocusMode } = useApp();
  const isTrivia = location.pathname.startsWith("/trivia");

  return (
    <div className="min-h-screen w-full max-w-full [overflow-x:clip] flex flex-col bg-background selection:bg-accent/30">
      <LoadingBar />
      
      {!isFocusMode && <Navbar />}
      {!isFocusMode && <div className="h-16 w-full shrink-0" />}
      
      <main className="flex-1 flex flex-col relative w-full max-w-full [overflow-x:clip]">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col w-full max-w-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {!isFocusMode && <Footer />}
      {!isFocusMode && !isTrivia && <CommunityButton />}
    </div>
  );
};
