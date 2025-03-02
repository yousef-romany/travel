import { Pyramid } from "lucide-react"

interface NoDataPlaceholderProps {
  message?: string
  suggestion?: string
}

export function NoDataPlaceholder({
  message = "Oops! It seems the ancient scrolls are missing.",
  suggestion = "Try exploring other wonders of Egypt while we decipher more hieroglyphs.",
}: NoDataPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-secondary/30 rounded-lg">
      <Pyramid className="w-16 h-16 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground">{suggestion}</p>
    </div>
  )
}

