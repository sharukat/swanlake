"use client";

import React, { useEffect, useState } from "react";
import AppCard from "@/components/Cards";
import { LayoutImageGrid } from "@/components/ImageGrid";
import { ImagesSliderComp } from "@/components/imageSlider";
import Context from "@/contexts/context";
import { useCollections } from "@/hooks/use-collections";
import { Spinner } from "@heroui/react";
import { Image } from "@heroui/react";

export default function Home() {
  const { names, images, setImages, response, setResponse, fetchNames, generate } = useCollections();
  const [name, setName] = useState<string>(() => { return "" });
  const [status, setStatus] = useState<boolean>(() => { return false });

  useEffect(() => {
    if (response.length > 0) {
      setStatus(false);
    }
  }, [response]);


  return (
    <Context.Provider value={{
      names,
      response,
      setResponse,
      fetchNames,
      generate,
      images,
      setImages,
      name,
      setName,
      status,
      setStatus
    }}>
      <section key="home" className="w-full flex flex-col items-center justify-center px-auto">
        <ImagesSliderComp />

        <div className="flex flex-col justify-center items-center mx-auto">
          <Image
            alt="logos"
            className="m-5 mx-auto"
            src="logos.png"
            width={600}
          />
        </div>

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

        {(status) && (
          <div className="flex flex-col items-center justify-center">
            <Spinner classNames={{ label: "text-foreground mt-4" }} label="Processing" variant="wave" size="lg" />
          </div>
        )}

        {(name !== "") && (
          <h2 className="font-semibold text-center text-2xl p-5 mt-10">{name}</h2>
        )}
        {(response.length > 0) && (
          <div className="flex flex-col max-w-7xl items-center justify-center bg-gray-100 rounded-2xl w-full">
            <h2 className="font-semibold text-left justify-start">Based on Swan Lake Data</h2>
            <p className="text-gray-600 text-xl font-light text-justify p-10">
              {response[0]}
            </p>
            <h2 className="text-semibold">Based on Web Search</h2>
            <p className="text-gray-600 text-xl font-light text-justify p-10">
              {response[1]}
            </p>
          </div>
        )}

        {(images.length > 0) && (
          <div className="flex w-full mt-10 items-center justify-center px-auto">
            <LayoutImageGrid />
          </div>
        )}


      </section >
    </Context.Provider>
  );
}

function transformString(input: string): string {
  // Remove double quotes from the beginning and end of the string
  let transformed = input.replace(/^"|"$/g, '');

  // Replace escaped newline characters with actual newlines
  transformed = transformed.replace(/\\n/g, '\n\n');

  return transformed;
}