function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner