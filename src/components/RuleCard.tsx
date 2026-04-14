import { SquarePen, Pause, Trash2, Play } from "lucide-react"

interface Rule {
    id: string
    keywords: string[]
    response: string
    paused: boolean
}

interface RuleCardProps {
    rule: Rule
    onEdit: (rule: Rule) => void
    onTogglePause: (ruleId: string) => void
    onDelete: (ruleId: string) => void
}

export const RuleCard = ({ rule, onEdit, onTogglePause, onDelete }: RuleCardProps) => {
    return (
        <div
            className={`border border-gray-300 rounded-xl p-5 space-y-5 ${rule.paused ? "opacity-50" : ""}`}
        >
            <div className="flex items-baseline gap-10">
                <p className="text-gray-400">Keywords</p>
                <div className="flex flex-wrap gap-2">
                    {rule.keywords.map((kw) => (
                        <span
                            key={kw}
                            className="px-3 py-1 bg-slate-500 text-white rounded-full text-sm"
                        >
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-baseline gap-10">
                <p className="text-gray-400">Response</p>
                <p className="text-sm">{rule.response}</p>
            </div>
            <div className="flex justify-between items-center">
                {rule.paused ? (
                    <span className="text-xs text-amber-600 font-medium">Paused</span>
                ) : (
                    <span />
                )}
                <div className="flex gap-5">
                    <SquarePen
                        size={20}
                        className="text-gray-400 cursor-pointer hover:text-primary transition-colors duration-200"
                        onClick={() => onEdit(rule)}
                    />
                    {rule.paused ? (
                        <Play
                            size={20}
                            className="text-gray-400 cursor-pointer hover:text-green-500 transition-colors duration-200"
                            onClick={() => onTogglePause(rule.id)}
                        />
                    ) : (
                        <Pause
                            size={20}
                            className="text-gray-400 cursor-pointer hover:text-primary transition-colors duration-200"
                            onClick={() => onTogglePause(rule.id)}
                        />
                    )}
                    <Trash2
                        size={20}
                        className="text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200"
                        onClick={() => onDelete(rule.id)}
                    />
                </div>
            </div>
        </div>
    )
}
