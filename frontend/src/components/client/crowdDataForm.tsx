"use client";

import React, { useEffect, useState, useRef } from "react";
import { CATEGORIES, NATURE_GROUPS } from "@/lib/constants";
import ImageUpload from "@/components/client/imageUpload";
import Context from "@/contexts/imageContext";
import {
  Form,
  Input,
  Button,
  Select,
  SelectItem,
  NumberInput,
  DatePicker,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import Image from "next/image";

export default function CrowdDataForm() {
  const [image, setImage] = useState<string>("");

  const getNatureGroup = (category: string) => {
    switch (category) {
      // case "plants":
      //     return natureGroup.plant;
      case "birds":
        return NATURE_GROUPS.birds || [];
      // case "animals":
      //     return natureGroup.animal;
      default:
        return [];
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Context.Provider value={{ image, setImage }}>
      <Form
        className="w-full flex flex-col gap-4 items-center"
        onReset={() => {
          //   setAction("reset");
          //   setFiles([]);
          //   setSelectedCategory("");
          //   setSelectedNatureGroups([]);
        }}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex sm-flex-col-1 md-flex-col-2 gap-5 w-full">
          <div className="flex flex-col gap-5 w-full">
            <Select
              isRequired
              className="max-w-sm"
              label="Input Category"
              placeholder="Select a category"
              labelPlacement="outside"
              name="category"
              //   value={selectedCategory}
              //   onChange={handleCategoryChange}
            >
              {CATEGORIES.map((category) => (
                <SelectItem key={category.key}>{category.label}</SelectItem>
              ))}
            </Select>

            <Input
              isRequired
              className="max-w-sm"
              errorMessage="Please enter a name"
              label="Bird/Plant/Animal Name"
              labelPlacement="outside"
              name="common_name"
              placeholder="Enter the name"
              type="text"
            />

            <NumberInput
              isRequired
              className="max-w-xs"
              defaultValue={1}
              label="Count observed"
              placeholder="Enter the amount"
            />

            <Input
              className="max-w-sm"
              label="Scientific Name"
              labelPlacement="outside"
              name="scientific_name"
              placeholder="Enter the scientific name (if known)"
              type="text"
            />

            <DatePicker
              isRequired
              className="max-w-sm"
              label="Observed date"
              name="observed_date"
              labelPlacement="outside"
            />

            <ImageUpload name="image" label="Upload Image" />
          </div>

          {/* IMAGE_PICKER */}
          <div className="flex flex-col items-center w-full max-w-[50%] max-h-[50%] border-1 rounded-lg border-gray-300 relative aspect-square">
            {!image && <p>No image picked yet.</p>}
            {image && (
              <Image
                alt="Selected image"
                fill
                src={image}
                className="object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* <div className="flex flex-col gap-2 w-full pt-5">
          <Accordion variant="shadow">
            <AccordionItem
              key="1"
              aria-label="Advanced"
              subtitle="Add more details if known (optional)"
              title="Advanced Data"
            >
              <div className="flex flex-col gap-2">
                <Select
                  isRequired
                  className="max-w-xs"
                  selectionMode="multiple"
                  label="Nature Counts Grouping"
                  placeholder="Select a category"
                  labelPlacement="outside"
                  name="nature_group"
                  value={selectedNatureGroups}
                  isDisabled={!getNatureGroup(selectedCategory).length}
                  onChange={handleNatureGroupChange}
                >
                  {getNatureGroup(selectedCategory).map((category) => (
                    <SelectItem key={category.key}>{category.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </AccordionItem>
          </Accordion> */}
        {/* </div> */}

        <div className="flex gap-2">
          <Button color="primary" type="submit">
            Submit
          </Button>
          <Button type="reset" variant="flat">
            Reset
          </Button>
        </div>
      </Form>
    </Context.Provider>
  );
}
