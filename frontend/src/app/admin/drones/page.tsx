"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, SelectItem, DatePicker, Accordion, AccordionItem } from "@heroui/react";
import { FileUpload } from "@/components/ui/file-upload";


export default function Drones() {
    const [action, setAction] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };

    return (
        <section key="drones" className="w-full flex flex-col items-center justify-center px-auto bg-white">
            <div
                className="overflow-hidden w-full relative flex items-center justify-center h-[5rem]"
            >
                <div className="absolute top-0 left-0 w-full h-20 pl-20">
                    <div className="flex flex-col justify-center items-start h-full">
                        <h1 className="text-3xl text-black font-bold">Add Drone Footages</h1>
                    </div>
                </div>
            </div>
            <div className="flex flex-col max-w-5xl w-full justify-center items-center mx-auto mt-5">
                <Form
                    className="w-full flex flex-col gap-4 items-center"
                    onReset={() => setAction("reset")}
                    onSubmit={(e) => {
                        e.preventDefault();
                        let data = Object.fromEntries(new FormData(e.currentTarget));

                        setAction(`submit ${JSON.stringify(data)}`);
                    }}
                >
                    <div className="flex sm-flex-col-1 md-flex-col-2 gap-5 w-full">
                        <div className="flex flex-col gap-5 w-full">                        

                            <Input
                                isRequired
                                className="max-w-sm"
                                errorMessage="Please enter a name"
                                label="Footage Identification Name"
                                labelPlacement="outside"
                                name="footage_name"
                                placeholder="Enter a name for the footage"
                                type="text"
                            />

                            <DatePicker isRequired className="max-w-sm" label="Captured date" name="captured_date" labelPlacement="outside" />
                        </div>

                        <div className="flex flex-col items-center w-full">
                            <FileUpload onChange={handleFileUpload} />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button color="primary" type="submit">
                            Submit
                        </Button>
                        <Button type="reset" variant="flat">
                            Reset
                        </Button>
                    </div>
                    {action && (
                        <div className="text-small text-default-500">
                            Action: <code>{action}</code>
                        </div>
                    )}
                </Form>
            </div>

        </section >
    )
}