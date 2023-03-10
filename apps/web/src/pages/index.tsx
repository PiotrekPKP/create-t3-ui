import { NextPage } from "next";
import { useTheme } from "next-themes";
import Image from "next/image";

const IMAGE_SIZE = 120;

const Index: NextPage = () => {
  const { theme } = useTheme();

  return (
    <div>
      <h1>Choose your preferred template</h1>
      <div className="mt-24">
        <div>
          <Image
            alt=""
            src={`/assets/icons/app-${theme}.svg`}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
