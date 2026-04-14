import { useState } from "react"
import { useParams } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, X } from "lucide-react"
import { supabaseClient } from "../libs/supabaseClient"
import { Modal } from "../components/Modal"
import { RuleCard } from "../components/RuleCard"

interface Rule {
    id: string
    keywords: string[]
    response: string
    paused: boolean
}

export const RulePage = () => {
    const { id } = useParams()
    const queryClient = useQueryClient()

    const [modalOpen, setModalOpen] = useState(false)
    const [editingRule, setEditingRule] = useState<Rule | null>(null)
    const [formKeywords, setFormKeywords] = useState<string[]>([])
    const [formResponse, setFormResponse] = useState("")
    const [keywordInput, setKeywordInput] = useState("")

    const query = useQuery({
        queryKey: ["agent-rules", id],
        queryFn: async () => {
            const { data, error } = await supabaseClient
                .from("agents")
                .select("id, rules")
                .eq("id", id)
                .single()

            if (error) throw new Error(error.message)
            return data as { id: string; rules: Rule[] | null }
        },
    })

    const rules: Rule[] = query.data?.rules ?? []

    const updateRulesMutation = useMutation({
        mutationFn: async (newRules: Rule[]) => {
            const { error } = await supabaseClient
                .from("agents")
                .update({ rules: newRules })
                .eq("id", id)
                .select("id")
                .single()

            if (error) throw new Error(error.message)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agent-rules", id] })
        },
    })

    const openCreateModal = () => {
        setEditingRule(null)
        setFormKeywords([])
        setFormResponse("")
        setKeywordInput("")
        setModalOpen(true)
    }

    const openEditModal = (rule: Rule) => {
        setEditingRule(rule)
        setFormKeywords([...rule.keywords])
        setFormResponse(rule.response)
        setKeywordInput("")
        setModalOpen(true)
    }

    const handleAddKeyword = () => {
        const trimmed = keywordInput.trim()
        if (trimmed && !formKeywords.includes(trimmed)) {
            setFormKeywords((prev) => [...prev, trimmed])
        }
        setKeywordInput("")
    }

    const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddKeyword()
        }
    }

    const handleRemoveKeyword = (keyword: string) => {
        setFormKeywords((prev) => prev.filter((k) => k !== keyword))
    }

    const handleSave = () => {
        if (formKeywords.length === 0 || !formResponse.trim()) return

        let newRules: Rule[]
        if (editingRule) {
            newRules = rules.map((r) =>
                r.id === editingRule.id
                    ? { ...r, keywords: formKeywords, response: formResponse.trim() }
                    : r,
            )
        } else {
            const newRule: Rule = {
                id: crypto.randomUUID(),
                keywords: formKeywords,
                response: formResponse.trim(),
                paused: false,
            }
            newRules = [...rules, newRule]
        }

        updateRulesMutation.mutate(newRules, {
            onSuccess: () => {
                setModalOpen(false)
            },
        })
    }

    const handleTogglePause = (ruleId: string) => {
        const newRules = rules.map((r) =>
            r.id === ruleId ? { ...r, paused: !r.paused } : r,
        )
        updateRulesMutation.mutate(newRules)
    }

    const handleDelete = (ruleId: string) => {
        const newRules = rules.filter((r) => r.id !== ruleId)
        updateRulesMutation.mutate(newRules)
    }

    return (
        <div className="grow px-20 py-8 bg-white">
            <section className=" flex justify-between items-end gap-20 mb-10">
                <div>
                    <h1 className="text-3xl font-semibold text-primary">Rule</h1>
                    <p className="text-gray-400 mt-1">Set keyword-triggered rules so your agent automatically responds with pre-defined content when specific keywords are matched in a conversation.</p>
                </div>
                <section className=" shrink-0">
                    <button
                        onClick={openCreateModal}
                        className="ml-auto px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-2 cursor-pointer"
                    >
                        <Plus size={18} />
                        Add Rule
                    </button>
                </section>
            </section>

            {query.isError && (
                <div className="text-red-500 mb-4">
                    {(query.error as Error).message}
                </div>
            )}
            {updateRulesMutation.isError && (
                <div className="text-red-500 mb-4">
                    {(updateRulesMutation.error as Error).message}
                </div>
            )}
            <section className="grid grid-cols-2 gap-5">
                {rules.length === 0 && !query.isLoading && (
                    <p className="col-span-2 text-center text-gray-400 py-10">
                        No rules yet. Click "Add Rule" to create one.
                    </p>
                )}
                {query.isLoading && (
                    <p className="col-span-2 text-center text-gray-400 py-10">
                        Loading...
                    </p>
                )}
                {rules.map((rule) => (
                    <RuleCard
                        key={rule.id}
                        rule={rule}
                        onEdit={openEditModal}
                        onTogglePause={handleTogglePause}
                        onDelete={handleDelete}
                    />
                ))}
            </section>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingRule ? "Edit Rule" : "Add Rule"}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSave()
                    }}
                    className="flex flex-col gap-5"
                >
                    <label className="flex flex-col gap-2">
                        <span className="text-primary text-sm">Keywords</span>
                        <div className="flex flex-wrap gap-2 mb-1">
                            {formKeywords.map((kw) => (
                                <span
                                    key={kw}
                                    className="px-3 py-1 bg-slate-500 text-white rounded-full text-sm flex items-center gap-1"
                                >
                                    {kw}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveKeyword(kw)}
                                        className="hover:text-red-300 transition-colors cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            className="border border-gray-300 rounded-lg px-3 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            type="text"
                            placeholder="Type a keyword and press Enter"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={handleKeywordKeyDown}
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="text-primary text-sm">Response</span>
                        <textarea
                            className="border border-gray-300 rounded-lg px-3 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                            placeholder="Enter the response when keywords are matched..."
                            value={formResponse}
                            onChange={(e) => setFormResponse(e.target.value)}
                        />
                    </label>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-5 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                formKeywords.length === 0 ||
                                !formResponse.trim() ||
                                updateRulesMutation.isPending
                            }
                            className="px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateRulesMutation.isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}