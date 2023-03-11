import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.back()}
      className="mb-8 flex cursor-pointer items-center gap-2 text-gray-500 dark:text-gray-500"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </div>
  );
};

export default BackButton;
