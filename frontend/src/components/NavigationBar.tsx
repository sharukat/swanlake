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
                classNames={{item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                    "data-[active=true]:after:content-['']",
                    "data-[active=true]:after:absolute",
                    "data-[active=true]:after:bottom-3",
                    "data-[active=true]:after:left-0",
                    "data-[active=true]:after:right-0",
                    "data-[active=true]:after:h-[2px]",
                    "data-[active=true]:after:rounded-[2px]",
                    "data-[active=true]:after:bg-primary",
                  ],}}
            >
                <NavbarBrand>
                    <p className="font-bold text-inherit md:text-lg text-base">
                        <a href="/">Swan Lake</a>
                    </p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem isActive>
                        <Link color="foreground" href="/">
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
                        <Button as={Link} color="primary" href="/admin" radius="full">
                            Admin Panel
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
}