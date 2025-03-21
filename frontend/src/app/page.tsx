"use client";

import React, { useEffect, useState } from "react";
import AppCard from "@/components/Cards";
import { LayoutImageGrid } from "@/components/ImageGrid";
import { ImagesSliderComp } from "@/components/imageSlider";
import Context from "@/contexts/context";
import { useCollections } from "@/hooks/use-collections";

export default function Home() {
  const { names, images, fetchNames, generate } = useCollections();
  const [name, setName] = useState<string>(() => { return "" });

  useEffect(() => {
    console.log("Images updated:", images);
  }, [images]);

  return (
    <Context.Provider value={{
      names,
      fetchNames,
      generate,
      images,
      name,
      setName,
    }}>
      <section key="home" className="w-full flex flex-col items-center justify-center px-auto">
        <ImagesSliderComp />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-10 max-w-7xl px-auto p-10">
          <div className="md:col-span-2">
            <p className="text-gray-600 text-2xl text-left max-w-5xl">
              Swan Lake Park is home to a rich diversity of wildlife. Over 30
              years, Swan Lake Park has evolved from an inactive, obscure gravel
              pit to the centre piece of the thriving Greensborough community.
              <br /><br />
              Explore the Swan Lake wildlife and learn more about the birds and plants. List all the birds and plants and click any to get AI assisted information.
            </p>
          </div>

          <div className="grid gap-5 grid-cols-2">
            <AppCard imagePath="bird.jpg" buttonName="Explore Birds" />
            <AppCard imagePath="plant.jpg" buttonName="Explore Plants" />
          </div>
        </div>

        {(name !== "") && (
          <h2 className="font-semibold text-center text-2xl p-5 mt-10">{name}</h2>
        )}
        <div className="w-full mt-10">
          {(images.length > 0) && (
            <LayoutImageGrid />
          )}
        </div>

      </section >
    </Context.Provider>
  );
}
