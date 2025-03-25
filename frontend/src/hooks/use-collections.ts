import React, { useState } from "react";

export const useCollections = () => {
    const [names, setNames] = useState<string[]>(() => { return [] })
    const [images, setImages] = useState<string[]>(() => { return [] })
    const [response, setResponse] = useState<string>(() => { return "" })

    const fetchNames = async (collection_name: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/mongo/list/${collection_name}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            const data = await response.json();
            if (data) {
                setNames(data);
            } else {
                console.error("Received invalid response format from server");
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    }

    const generate = async (collection_name: string, name: string) => {
        try {
            const mongo_service_response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/generation/${collection_name}/${encodeURIComponent(name)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            const data = await mongo_service_response.json();
            if (data) {
                console.log("Fetched data", data);
                setResponse(data.response);
                setImages(Array.isArray(data.images) ? data.images : []);
            }
            
        } catch (error) {
            console.error("Submission error:", error);
        }
    }

    return { names, images, setImages, response, setResponse, fetchNames, generate }
};