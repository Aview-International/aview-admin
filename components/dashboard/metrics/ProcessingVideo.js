export default function ProcessingSpeedKPI({
  averageTime = 2.5,
  targetTime = 2.0,
}) {
  const isMeetingTarget = averageTime <= targetTime;
  const statusColor = isMeetingTarget ? 'text-green-600' : 'text-red-600';
  const statusText = isMeetingTarget ? 'Meeting Target' : 'Above Target';

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white-transparent p-6 shadow-md">
      <p className="text-gray-600 mb-2 text-lg">Avg Processing Time</p>
      <h3 className="text-red-700 text-5xl font-bold">
        {averageTime.toFixed(1)} hrs
      </h3>
      <p className="text-gray-500 mt-2">Target: {targetTime.toFixed(1)} hrs</p>
      <p className={`mt-1 text-sm font-semibold ${statusColor}`}>
        {statusText}
      </p>
    </div>
  );
}
