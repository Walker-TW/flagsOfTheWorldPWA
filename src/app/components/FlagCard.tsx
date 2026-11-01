import Image from "next/image";

export default function FlagCard({
  flagId,
  name,
  continent,
  capital,
  fact,
  revealed = true,
}: {
  flagId: string;
  name: string;
  continent?: string;
  capital?: string;
  fact?: string;
  // When false the details keep their space (so the card doesn't jump when
  // they appear) but are invisible, with a prompt to tap in their place.
  revealed?: boolean;
}) {
  return (
    <div className="flex flex-col short:flex-row items-center gap-4 p-8 short:p-4 bg-white rounded-2xl shadow-md w-80 short:w-[34rem] max-w-full">
      <div className="w-full h-48 short:w-48 short:h-32 short:shrink-0 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        <Image
          src={`/nationalFlags/${flagId.toLowerCase()}.svg`}
          alt={revealed ? name : "Mystery flag"}
          width={100}
          height={100}
          // Fit the flag inside a fixed 100px box, whatever its shape. Letting
          // the height shrink to the flag instead makes Next.js warn.
          className="size-[100px] object-contain"
          // The flag is the main thing on screen, so don't lazy-load it.
          loading="eager"
        />
      </div>
      <div className="relative min-w-0">
        {!revealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-500 animate-pulse motion-reduce:animate-none">
              Tap to reveal
            </span>
          </div>
        )}
        <div
          className={`flex flex-col items-center gap-4 short:gap-2 ${revealed ? "" : "invisible"}`}
        >
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
      </div>
    </div>
  );
}
