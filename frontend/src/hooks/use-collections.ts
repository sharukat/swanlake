import { useState } from "react";

export const useCollections = () => {
    const [names, setNames] = useState<string[]>(() => { return [] })

    const fetchNames = async (collection_name: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/mongodb/list/${collection_name}`,
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
    return { names, fetchNames }
};