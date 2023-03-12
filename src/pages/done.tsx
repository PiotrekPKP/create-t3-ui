import { type NextPage } from "next";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTurboState } from "~/utils/zustand";

const Done: NextPage = () => {
  const { clearStore } = useTurboState();

  useEffect(() => clearStore(), []);

  return (
    <div>
      <h1>Your project is ready!</h1>
      <p>Thanks for using Create T3 App!</p>

      <div className="mt-12">
        <Link href="/" className="flex w-fit items-center gap-2">
          <ArrowRight width={18} height={18} />
          <Button variant="link">Create another project</Button>
        </Link>
      </div>
    </div>
  );
};

export default Done;
