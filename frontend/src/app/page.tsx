import Image from "next/image";
import AppCard from "@/components/Cards";
import { ImagesSliderComp } from "@/components/imageSlider";

export default function Home() {
  return (
    <section key="home" className="w-full flex flex-col items-center justify-center">
      <ImagesSliderComp/>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-10">
          <AppCard imagePath="bird.jpg" buttonName="Explore Birds" />
          <AppCard imagePath="plant.jpg" buttonName="Explore Plants" />

      </div>
    </section>
  );
}
