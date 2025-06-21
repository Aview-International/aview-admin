export default function TotalVideosMetric({ totalVideos = 12450 }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white-transparent p-6 shadow-md">
      <p className="text-gray-600 mb-2 text-lg">Total Videos Processed</p>
      <h2 className="text-gray-800 text-6xl font-bold">
        {totalVideos.toLocaleString()}
      </h2>
    </div>
  );
}
