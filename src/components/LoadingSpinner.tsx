
export default function LoadingSpinner(){
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full animate-spin border-4 border-slate-200 border-t-primary"></div>
      <div className="text-sm text-slate-600">Analyzing resume — this may take a few seconds</div>
    </div>
  )
}
 