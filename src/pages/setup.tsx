import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";

const Setup: NextPage = () => {
  const [data, setData] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);

  //imitate progress going up
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 100) {
          return 100;
        }

        return prev + 0.02;
      });
    }, 1);

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawData = localStorage.getItem("__T3_UI_DATA__");

      if (!rawData) {
        router.push("/");

        return;
      }

      setData(rawData);
    }
  }, [router]);

  return (
    <>
      <div>
        <h1>Setting up your project...</h1>
        <p>Wait for everything to finish...</p>
        <div className="mt-12">
          <Progress value={progressValue} />
        </div>
      </div>
      {!!data && (
        <div id="doneDataElement" className="hidden">
          {data}
        </div>
      )}
    </>
  );
};

export default Setup;
