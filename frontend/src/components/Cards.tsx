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
  Button,
  Listbox,
  ListboxItem
} from "@heroui/react";
import React, { useState } from "react";
import { useCollections } from "../hooks/use-collections";

interface AppCardProps {
  imagePath: string;
  buttonName: string;
}

export default function AppCard({ imagePath, buttonName }: AppCardProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { names, fetchNames, generate } = useCollections();
  const [collection, setCollection] = useState<string>(() => { return "" });

  const handlePress = async (buttonName: string) => {
    if (buttonName === "Explore Birds") {
      setCollection("birds");
      await fetchNames("birds");
    } else if (buttonName === "Explore Plants") {
      setCollection("plants");
      await fetchNames("plants");
    } else {
      console.error("Invalid button name");
    }
    onOpen();
  }

  const handleItemPress = async (name: string) => {
    await generate(collection, name);
    onClose();
  }

  return (
    <div className="flex flex-col">
      <Card isFooterBlurred className="border-none" radius="lg" isPressable onPress={() => handlePress(buttonName)}>
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
              <DrawerHeader className="flex flex-col gap-1">
                <p className="text-2xl font-semibold">Select an Item</p>
                <p className="font-light">Below is a list of {collection} found in Swanlake Park. Click on any to get more information.</p>
              </DrawerHeader>
              <DrawerBody>
                <Listbox aria-label="Actions">
                  {names.map((name) => (
                    <ListboxItem key={name} onPress={() => handleItemPress(name)}>{name}</ListboxItem>
                  ))}
                </Listbox>
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