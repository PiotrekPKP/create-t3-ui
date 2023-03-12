import { useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import { env } from "~/env.mjs";

const Success: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const query = router.query;

    if (query.success === "true") {
      // pass down message to extension
      chrome.runtime.sendMessage(
        env.NEXT_PUBLIC_EXTENSION_ID,
        { action: "signout" },
        (_res: { success: boolean }) => {
          // do something with response
          setTimeout(() => close(), 1000);
        }
      );
    }
  }, [router]);

  return (
    <div className="mx-auto flex h-screen max-w-lg flex-col items-center justify-center">
      <p>Are you sure you&apos;d like to sign out?</p>
      <button
        className="mt-4 cursor-pointer rounded-md border border-gray-300 px-4 py-2"
        onClick={() =>
          void signOut({ callbackUrl: "/ext-auth/signout?success=true" })
        }
      >
        Sign Out
      </button>
    </div>
  );
};
export default Success;
