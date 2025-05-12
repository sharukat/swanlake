"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);

  return (
    <motion.div
      className="relative flex h-full max-h-[90%] justify-center space-x-10 overflow-y-scroll rounded-md p-10"
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => {
            const itemRef = useRef(null);
            const isInView = useInView(itemRef, {
              margin: "-50% 0px -50% 0px",
              amount: "some",
            });

            useEffect(() => {
              if (isInView) {
                setActiveCard(index);
              }
            }, [isInView]);

            return (
              <div key={item.title + index} ref={itemRef} className="my-20">
                <motion.h2
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="text-2xl md:text-4xl font-bold text-slate-600"
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="text-xl mt-10 text-slate-900"
                >
                  {item.description}
                </motion.p>
              </div>
            );
          })}
          <div className="h-40" />
        </div>
      </div>
      <div
        className={cn(
          "sticky max-w-lg top-[25%] hidden h-80 w-80 overflow-hidden rounded-3xl lg:block",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
