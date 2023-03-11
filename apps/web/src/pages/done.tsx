import { NextPage } from "next";
import { useEffect } from "react";

const Done: NextPage = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }, []);

  return (
    <div>
      <h1>Your project is ready!</h1>
      <p>Thanks for using Create T3 App!</p>
    </div>
  );
};

export default Done;
