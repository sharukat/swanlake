"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Card,
  CardFooter,
  Image,
  Button
} from "@heroui/react";
import React from "react";

interface AppCardProps {
  imagePath: string;
  buttonName: string;
}

export default function AppCard({ imagePath, buttonName }: AppCardProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col">
      <Card isFooterBlurred className="border-none" radius="lg" isPressable onPress={onOpen}>
        <Image
          alt="Image dropdown card"
          className="object-cover"
          height={200}
          src={imagePath}
          width={200}
        />
        <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 justify-center">
        <p className="text-base font-bold text-white/80">{buttonName}</p>
        </CardFooter>
      </Card>
      <Drawer backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Select an Item</DrawerHeader>
              <DrawerBody>
                <p>Content</p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}