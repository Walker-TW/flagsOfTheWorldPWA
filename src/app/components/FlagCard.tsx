import Image from "next/image";

export default function FlagCard({
  flagId,
  name,
  continent,
  capital,
  fact,
}: {
  flagId: string;
  name: string;
  continent?: string;
  capital?: string;
  fact?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-md w-80">
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        <Image
          src={`/nationalFlags/${flagId.toLowerCase()}.svg`}
          alt={name}
          width={100}
          height={100}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        {continent && (
          <div className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
            {continent}
          </div>
        )}
        {/* Long names wrap onto balanced, centred lines at a smaller size. */}
        <div
          className={`${name.length > 24 ? "text-xl" : "text-2xl"} font-bold text-gray-800 text-center text-balance`}
        >
          {name}
        </div>
      </div>
      <div className="text-gray-500 text-sm">{capital}</div>
      <div className="text-gray-600 text-sm italic text-center">{fact}</div>
    </div>
  );
}
