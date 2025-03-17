"use client";

import React from "react";
import {
    Link,
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@heroui/react";

export default function Navigationbar() {
    return (
        <div className="flex justify-center w-[80%] fixed top-0 z-20">
            <Navbar
                className="w-[80%] mt-5 rounded-full bg-background/40 backdrop-blur-xl"
            >
                <NavbarBrand>
                    <p className="font-bold text-inherit md:text-lg text-base">
                        SwanLake
                    </p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link color="foreground" href="#home">
                            AI Assistant
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#home">
                            VR Applications
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#home">
                            Drons Footages
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button as={Link} color="primary" href="#" radius="full">
                            Admin Panel
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
}