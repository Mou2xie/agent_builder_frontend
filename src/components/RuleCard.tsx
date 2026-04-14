import { SquarePen, Trash2 } from "lucide-react"

interface Rule {
    id: string
    keywords: string[]
    response: string
    paused: boolean
}

interface RuleCardProps {
    rule: Rule
    onEdit: (rule: Rule) => void
    onDelete: (ruleId: string) => void
}

export const RuleCard = ({ rule, onEdit, onDelete }: RuleCardProps) => {
    return (
        <div className="bg-background-card border border-border-light rounded-xl px-8 pt-8">
            <div className="flex flex-wrap gap-2 mb-4">
                {rule.keywords.map((kw) => (
                    <span
                        key={kw}
                        className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium"
                    >
                        {kw}
                    </span>
                ))}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-6">{rule.response}</p>
            <div className="flex justify-end items-center gap-5 py-5 border-t border-border-divider">
                <SquarePen
                    size={22}
                    className=" text-text-muted cursor-pointer hover:text-primary transition-colors duration-200"
                    onClick={() => onEdit(rule)}
                />
                <Trash2
                    size={22}
                    className=" text-text-muted cursor-pointer hover:text-red-400 transition-colors duration-200"
                    onClick={() => onDelete(rule.id)}
                />
            </div>
        </div>
    )
}
