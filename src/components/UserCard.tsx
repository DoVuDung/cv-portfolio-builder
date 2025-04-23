export default function UserCard() {
  return (
    <div className="w-80 bg-white shadow-xl rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            className="h-16 w-16 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            alt="avatar"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Jane Doe</h2>
            <p className="text-sm text-gray-500">Product Designer</p>
          </div>
        </div>
        <button className="rounded-full bg-purple-100 px-4 py-1 text-purple-700 font-semibold text-sm hover:bg-purple-200 transition">
          Follow
        </button>
      </div>

      <div className="mt-4 border-t pt-4 text-sm text-gray-600">
        Passionate about building intuitive digital experiences. Always learning.
      </div>

      <div className="mt-4 flex gap-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">#UX</span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">#Design</span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">#UI</span>
      </div>
    </div>
  )
}
