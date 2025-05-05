"use client";
import React, { use, useEffect, useState } from "react";
import { Form, Input, Button, Select, SelectItem, DatePicker, Accordion, AccordionItem } from "@heroui/react";
import { FileUpload } from "@/components/ui/file-upload";
import { useAddRecords } from "@/hooks/use-addrecords";
import { CATEGORIES, NATURE_GROUPS } from "@/lib/constants";


export const Admin = () => {
    const [action, setAction] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedNatureGroups, setSelectedNatureGroups] = useState([]);
    const { addRecords } = useAddRecords();


    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log("Files uploaded: ", files);
    };

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
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            
            formData.append("category", selectedCategory);
            
            const commonName = e.currentTarget.elements.common_name.value;
            const scientificName = e.currentTarget.elements.scientific_name.value;
            const observedDate = e.currentTarget.elements.observed_date.value;
            formData.append("common_name", commonName);
            formData.append("scientific_name", scientificName);
            formData.append("observed_date", observedDate);
            
            if (files.length > 0) {
                formData.append("image", files[0]);
            }
            
            if (selectedNatureGroups.length > 0) {
                selectedNatureGroups.forEach(group => {
                    formData.append("nature_group", group);
                });
            }
            await addRecords(formData);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    const handleCategoryChange = (e: any) => {
        const category = e.target.value;
        setSelectedCategory(category);
        // Reset nature groups when category changes
        setSelectedNatureGroups([]);
    };

    const handleNatureGroupChange = (e: any) => {
        const value = e.target.value;
        setSelectedNatureGroups(typeof value === 'string' ? value.split(',').filter(Boolean) : value);
    };

    return (
        <section key="admin" className="w-full flex flex-col items-center justify-center px-auto bg-white">
            <div
                className="overflow-hidden w-full relative flex items-center justify-center h-[5rem]"
            >
                <div className="absolute top-0 left-0 w-full h-20 pl-20">
                    <div className="flex flex-col justify-center items-start h-full">
                        <h1 className="text-3xl text-black font-bold">Add Plants, Birds, or Animals Data</h1>
                    </div>
                </div>
            </div>
            <div className="flex flex-col max-w-5xl w-full justify-center items-center mx-auto mt-5">
                <Form
                    className="w-full flex flex-col gap-4 items-center"
                    onReset={() => {
                        setAction("reset");
                        setFiles([]);
                        setSelectedCategory("");
                        setSelectedNatureGroups([]);
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
                                value={selectedCategory}
                                onChange={handleCategoryChange}
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
                                placeholder="Enter the name of the Bird/Animal/Plant"
                                type="text"
                            />
                            <Input
                                className="max-w-sm"
                                label="Scientific Name"
                                labelPlacement="outside"
                                name="scientific_name"
                                placeholder="Enter the scientific name (if known)"
                                type="text"
                            />

                            <DatePicker isRequired className="max-w-sm" label="Observed date" name="observed_date" labelPlacement="outside" />
                        </div>

                        <div className="flex flex-col items-center w-full">
                            <FileUpload 
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full pt-5">
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
                        </Accordion>
                    </div>




                    <div className="flex gap-2">
                        <Button color="primary" type="submit">
                            Submit
                        </Button>
                        <Button type="reset" variant="flat">
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>

        </section >
    )
}