export default function FlagCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-md w-80">
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
          Flag of China
        </div>
        <div className="text-2xl font-bold text-gray-800">China</div>
        <div className="text-gray-500 text-sm">Beijing</div>
        <div className="text-gray-600 text-sm italic text-center">
          Its Got A REAL big wall
        </div>
      </div>
    </div>
  );
}
