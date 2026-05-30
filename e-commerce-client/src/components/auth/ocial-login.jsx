// components/auth/SocialLogin.jsx

import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SocialLogin() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex h-12 items-center justify-center gap-3 rounded-xl border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900">
          <FaGoogle />
          Google
        </button>

        <button className="flex h-12 items-center justify-center gap-3 rounded-xl border transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900">
          <FaGithub />
          GitHub
        </button>
      </div>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />

        <span className="text-sm text-gray-400">OR</span>

        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
    </>
  );
}
