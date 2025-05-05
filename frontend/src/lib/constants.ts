import { Category, NatureGroup } from "@/app/models/database-records";


export const CATEGORIES: Category[] = [
    { key: "plants", label: "Plants" },
    { key: "birds", label: "Birds" },
    { key: "animals", label: "Animals" },
];

export const NATURE_GROUPS: NatureGroup = {
    birds: [
        { key: "insectivores", label: "Aerial Insectivores" },
        { key: "forest", label: "Forest Birds" },
        { key: "migrant", label: "Long Distance Migrant" },
    ],
    plants: [], // Add plant categories when available
    animals: [], // Add animal categories when available
};