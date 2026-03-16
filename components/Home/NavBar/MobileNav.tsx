"use client";

import { useState, useEffect } from "react";
import { HiBars3BottomRight, HiXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [hasLogin, setHasLogin] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("fpl_manager_id");
    setHasLogin(!!id);
  }, []);

  return (
    <div className="lg:hidden flex items-center">
      {/* Burger */}
      <HiBars3BottomRight
        size={28}
        className="text-white cursor-pointer"
        onClick={() => setOpen(true)}
      />

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed top-20 left-0 w-full h-[calc(100vh-80px)] z-30 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 bg-[#062b20] z-100 p-8 flex flex-col gap-10 text-white shadow-2xl border-l border-white/10"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              {/* Close */}
              <div className="flex justify-end">
                <HiXMark size={26} className="cursor-pointer" onClick={() => setOpen(false)} />
              </div>

              {/* Links */}
              <ul className="flex flex-col gap-8 text-xl font-medium">
                <li>
                  <Link
                    href={hasLogin ? "/prediction" : "/login"}
                    onClick={() => setOpen(false)}
                    className="hover:text-green-500 transition"
                  >
                    Prediction
                  </Link>
                </li>

                <li>
                  <Link
                    href={hasLogin ? "/planner" : "/login"} 
                    className="hover:text-green-500 transition font-medium"
                  >
                    Planner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/players"
                    className="hover:text-green-500 cursor-pointer transition-colors"
                  >
                    Players
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fixtures"
                    className="hover:text-green-500 cursor-pointer transition-colors"
                  >
                    Fixtures
                  </Link>
                </li>

                <li>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-green-500 font-semibold"
                  >
                    {hasLogin ? "Change Team" : "Login"}
                  </Link>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}