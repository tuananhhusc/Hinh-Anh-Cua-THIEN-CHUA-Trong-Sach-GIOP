"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

    return (
        <div ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]">
            {/* Decorative Elements - Smaller on mobile */}
            <div className="absolute inset-0 border-[8px] sm:border-[12px] md:border-[16px] border-[var(--background)] z-20 pointer-events-none"></div>
            <div className="absolute inset-2 sm:inset-3 md:inset-4 border border-[var(--accent)]/30 z-10 pointer-events-none"></div>

            {/* Parallax Content */}
            <motion.div style={{ y: textY }} className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-[family-name:var(--font-heading)] font-bold mb-4 sm:mb-6 md:mb-8 leading-tight sm:leading-none tracking-tight sm:tracking-tighter text-[var(--foreground)]"
                >
                    HÌNH ẢNH <br />
                    <span className="text-[var(--accent)]">THIÊN CHÚA</span> <br />
                    TRONG SÁCH GIÓP
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100px" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-[2px] bg-[var(--accent)] mx-auto mb-4 sm:mb-6 md:mb-8"
                ></motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-sm sm:text-base md:text-xl lg:text-2xl font-[family-name:var(--font-body)] text-[var(--foreground)]/80 italic px-2"
                >
                    Khảo luận toàn diện về Thần học Đau khổ,<br className="hidden sm:inline" /><span className="sm:hidden"> </span>Chủ quyền và Công lý Vũ trụ
                </motion.p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{
                    opacity: { delay: 1.5, duration: 1 },
                    y: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut" // Smooth sine wave 
                    }
                }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[var(--accent)] cursor-pointer"
            >
                <ChevronDown size={32} />
            </motion.div>
        </div>
    );
}
