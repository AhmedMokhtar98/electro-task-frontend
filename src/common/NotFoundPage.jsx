import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <HiOutlineExclamationCircle className="text-red-500 text-7xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="mb-6 text-gray-400">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[var(--primary-color)] text-white text-sm font-semibold rounded-xl"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
