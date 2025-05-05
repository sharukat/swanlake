"use client";

import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconDrone,
    IconDropletHalf2Filled,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Admin } from "./admin";
import { Drones } from "./drones";


export default function SidebarAdmin() {
    const links = [
        {
            label: "Add Data",
            href: "#",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            componentId: "admin",
        },
        {
            label: "Water Quality Data",
            href: "#",
            icon: (
                <IconDropletHalf2Filled className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            componentId: "waterQuality",
        },
        {
            label: "Drone Footages",
            href: "#drones",
            icon: (
                <IconDrone className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            componentId: "drones",
        },
        {
            label: "Settings",
            href: "#",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            componentId: "settings",
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            componentId: "logout",
        },
    ];

    const [activeComponent, setActiveComponent] = useState<string>("admin");
    const [open, setOpen] = useState(false);

    const handleLinkClick = (e: any, componentId: string) => {
        e.preventDefault();
        setActiveComponent(componentId);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case "admin":
                return <Admin />;
            case "drones":
                return <Drones />;
            case "waterQuality":
                return <div className="p-6"><h2 className="text-2xl font-bold">Water Quality Data</h2><p>Water quality data will be displayed here.</p></div>;
            case "settings":
                return <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2><p>Settings options will be displayed here.</p></div>;
            case "logout":
                return <div className="p-6"><h2 className="text-2xl font-bold">Logout</h2><p>Logout confirmation will be displayed here.</p></div>;
            default:
                return <Admin />;
        }
    };

    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
        >
            <Sidebar open={open} setOpen={setOpen} animate={false}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <>
                            <Logo />
                        </>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <div key={idx} onClick={(e) => handleLinkClick(e, link.componentId)}>
                                    <SidebarLink key={idx} link={link} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Sharuka Thirimanne",
                                href: "#",
                                icon: (
                                    <img
                                        src="avatar.jpg"
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            {renderComponent()}
        </div>
    );
}

export const Logo = () => {
    return (
        <div className="flex flex-col">
            <a
                href="#"
                className="relative z-20 flex items-center space-x-2 py-1 text-lg font-semibold text-black pt-5"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium whitespace-pre text-black dark:text-white"
                >
                    Admin Panel
                </motion.span>
            </a>
            <p className="text-black text-sm font-normal pt-2">This page enables the database to be populated with the latest data, ensuring it remains current and up-to-date.</p>
        </div>
    );
};