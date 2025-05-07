import { Category, NatureGroup } from "@/app/models/database-records";
import {
  IconBrandTabler,
  IconDrone,
  IconDropletHalf2Filled,
} from "@tabler/icons-react";
import { SKELTON } from "@/components/server/bento-skelton";

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

export const ADMIN_LINKS = [
  {
    label: "Add Data",
    href: "/admin",
    icon: (
      <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Water Quality Data",
    href: "#",
    icon: (
      <IconDropletHalf2Filled className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Drone Footages",
    href: "/admin/drones",
    icon: (
      <IconDrone className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
];

// Bento grid items for landing page
export const BENTOGRID_ITEMS = [
  {
    title: "Explore Swan Lake",
    description: "Discover the rich wildlife of Swan Lake Park with Artificial Intelligence (AI) – from vibrant birds and unique plants to fascinating animals, there’s so much to explore and learn in this natural haven.",
    header: <SKELTON path="/bg-1.jpg" />,
    className: "md:col-span-2",
  },
  {
    title: "Swan Lake Arial Footages",
    description: "Examine the drone footages, which features thermal maps, diverse habitats, and visuals of wildlife.",
    header: <SKELTON path="/bento-drone.jpg" />,
    className: "md:col-span-1",
  },
  {
    title: "Virtual Reality for Swan Lake",
    description: "Experience Swan Lake Park with our virtual reality tour, showcasing the park’s landscapes and wildlife.",
    header: <SKELTON path="/bento-vr.jpg"/>,
    className: "md:col-span-1",
  },
  {
    title: "Swan Lake Water Quality",
    description:
      "Dive into the water quality data from Swan Lake Park—uncover key insights into temperature trends, pH balance, and turbidity levels that reveal the health of this vital ecosystem.",
    header: <SKELTON path="/bg-2.jpg" />,
    className: "md:col-span-2",
  },
];
