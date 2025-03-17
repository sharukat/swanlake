"use client";
import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "./ui/image-slider";

export function ImagesSliderComp() {
    const images = [
        "bg-1.jpg",
        "bg-2.jpg",
        "bg-3.jpg",
        "bg-4.jpg",
    ];
    return (
        <div className="relative w-full">
            <ImagesSlider className="h-[40rem]" images={images} overlay={false} direction="up">/
                <div className="absolute inset-0 bg-black/20 z-40" /> {/* Overall image darkening */}
                <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-background via-background/10 to-transparent z-40" />
                <motion.div
                    initial={{
                        opacity: 0,
                        y: -80,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="z-50 flex flex-col justify-center items-center"
                >
                    <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-100 py-4">
                        Friends of Swan Lake Park <br /> CIFAL York
                    </motion.p>
                </motion.div>
            </ImagesSlider>
            <div className="absolute -bottom-10 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent" />
        </div>
    );

}
