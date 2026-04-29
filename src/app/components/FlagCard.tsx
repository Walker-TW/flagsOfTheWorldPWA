import Image from "next/image";

export default function FlagCard({
  countryCode,
  countryName,
  capital,
  fact,
}: {
  countryCode: string;
  countryName: string;
  capital?: string;
  fact?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-md w-80">
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        <Image
          src={`/nationalFlags/${countryCode.toLowerCase()}.svg`}
          alt={countryName}
          width={100}
          height={100}
        />
      </div>
      <div className="text-2xl font-bold text-gray-800">{countryName}</div>
      <div className="text-gray-500 text-sm">{capital}</div>
      <div className="text-gray-600 text-sm italic text-center">{fact}</div>
    </div>
  );
}
