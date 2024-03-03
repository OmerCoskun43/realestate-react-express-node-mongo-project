function NotFoundPage() {
  return (
    <div className="flex  justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 Not Found</h1>
        <p className="text-lg font-bold text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <a href="/" className="text-blue-500 hover:underline">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go Back to the Homepage
          </button>
        </a>
      </div>
    </div>
  );
}

export default NotFoundPage;
