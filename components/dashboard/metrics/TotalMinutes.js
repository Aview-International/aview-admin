export default function TotalMinutesMetric({ totalMinutes = 747000 }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white-transparent p-6 shadow-md">
      <p className="text-gray-600 mb-2 text-lg">Total Content Mins</p>
      <h2 className="text-green-700 text-6xl font-bold">
        {Math.floor(totalMinutes / 60).toLocaleString()} hrs
      </h2>
      <p className="text-gray-500 mt-1 text-sm">
        ({totalMinutes.toLocaleString()} mins)
      </p>
    </div>
  );
}
