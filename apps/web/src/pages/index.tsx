import { NextPage } from "next";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckboxWithText } from "../components/ui/checkbox";

const IMAGE_SIZE = 80;

const AppOption: React.FC<{
  image: string;
  name: string;
  description: string;
}> = ({ image, name, description }) => {
  return (
    <div className="flex cursor-pointer flex-col items-start gap-6 rounded-md bg-black/5 p-8 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 md:flex-row md:items-center md:gap-12">
      <Image alt="" src={image} width={IMAGE_SIZE} height={IMAGE_SIZE} />

      <div>
        <h3 className="my-0 font-black">{name}</h3>
        <p className="!mt-2">{description}</p>
      </div>
    </div>
  );
};

const Index: NextPage = () => {
  const { theme } = useTheme();
  const [pictureTheme, setPictureTheme] = useState("light");

  useEffect(() => setPictureTheme(theme!), [theme]);

  return (
    <div>
      <h1>Choose your preferred template</h1>
      <p>
        Pick the option you want. If you want to build a web app, go with Create
        T3 App. However, if you'd like to have both web and mobile apps - pick
        the Create T3 Turbo option.
      </p>
      <div className="mt-12 flex flex-col gap-6 md:grid md:grid-rows-2">
        <AppOption
          image={`/assets/icons/app-${pictureTheme}.svg`}
          name="Create T3 App"
          description="The best way to start a full-stack, typesafe Next.js app"
        />
        <AppOption
          image={`/assets/icons/turbo.svg`}
          name="Create T3 Turbo"
          description="Clean and simple starter repo using the T3 Stack along with Expo React
          Native"
        />
      </div>
      <div className="mt-12">
        <CheckboxWithText text="Remember my choice" />
      </div>
    </div>
  );
};

export default Index;
