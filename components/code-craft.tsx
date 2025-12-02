"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Hammer, Pickaxe } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

type Resource = "variable" | "function" | "loop" | "condition"
type CraftedItem = "logic_gate" | "method_tool" | "app_structure"

interface Recipe {
  id: CraftedItem
  name: string
  ingredients: { resource: Resource; count: number }[]
  icon: React.ReactNode
  description: string
}

const RESOURCES: { id: Resource; name: string; color: string; icon: string }[] = [
  { id: "variable", name: "Variable Ore", color: "bg-blue-500", icon: "💎" },
  { id: "function", name: "Function Stone", color: "bg-gray-500", icon: "🪨" },
  { id: "loop", name: "Loop Timber", color: "bg-amber-600", icon: "🪵" },
  { id: "condition", name: "Condition Gem", color: "bg-purple-500", icon: "🔮" },
]

const RECIPES: Recipe[] = [
  {
    id: "logic_gate",
    name: "Logic Gate",
    ingredients: [
      { resource: "variable", count: 2 },
      { resource: "condition", count: 1 },
    ],
    icon: <div className="text-2xl">🚪</div>,
    description: "Combines variables and conditions to control flow.",
  },
  {
    id: "method_tool",
    name: "Method Tool",
    ingredients: [
      { resource: "function", count: 2 },
      { resource: "variable", count: 1 },
    ],
    icon: <div className="text-2xl">🛠️</div>,
    description: "A reusable block of code functionality.",
  },
  {
    id: "app_structure",
    name: "App Structure",
    ingredients: [
      { resource: "loop", count: 3 },
      { resource: "function", count: 1 },
    ],
    icon: <div className="text-2xl">🏗️</div>,
    description: "The backbone of a scalable application.",
  },
]

export function CodeCraft({ onClose }: { onClose: () => void }) {
  const [inventory, setInventory] = useState<Record<Resource, number>>({
    variable: 0,
    function: 0,
    loop: 0,
    condition: 0,
  })
  const [craftedItems, setCraftedItems] = useState<Record<CraftedItem, number>>({
    logic_gate: 0,
    method_tool: 0,
    app_structure: 0,
  })
  const [miningCooldown, setMiningCooldown] = useState<Resource | null>(null)

  const mineResource = (resource: Resource) => {
    if (miningCooldown) return

    setMiningCooldown(resource)
    setTimeout(() => setMiningCooldown(null), 500)

    setInventory((prev) => ({
      ...prev,
      [resource]: prev[resource] + 1,
    }))
  }

  const craftItem = (recipe: Recipe) => {
    const canCraft = recipe.ingredients.every((ing) => inventory[ing.resource] >= ing.count)

    if (canCraft) {
      setInventory((prev) => {
        const newInv = { ...prev }
        recipe.ingredients.forEach((ing) => {
          newInv[ing.resource] -= ing.count
        })
        return newInv
      })
      setCraftedItems((prev) => ({
        ...prev,
        [recipe.id]: prev[recipe.id] + 1,
      }))
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#58CC02", "#FFC800", "#1CB0F6"],
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-black/20 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-slate-700 p-4 flex items-center justify-between border-b-4 border-black/20">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-xl border-b-4 border-green-800">
              <Pickaxe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">CodeCraft</h2>
              <p className="text-gray-400 text-xs font-bold uppercase">Build Your World</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mining Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Pickaxe className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-200 font-bold uppercase tracking-wider text-sm">Resource Mining</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {RESOURCES.map((res) => (
                <motion.button
                  key={res.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => mineResource(res.id)}
                  disabled={!!miningCooldown}
                  className={`relative p-4 rounded-xl border-b-4 ${
                    miningCooldown === res.id ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    res.id === "variable"
                      ? "bg-blue-600 border-blue-800"
                      : res.id === "function"
                        ? "bg-gray-600 border-gray-800"
                        : res.id === "loop"
                          ? "bg-amber-600 border-amber-800"
                          : "bg-purple-600 border-purple-800"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl filter drop-shadow-md">{res.icon}</span>
                    <span className="text-white font-bold text-sm">{res.name}</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/30 px-2 py-1 rounded-lg text-xs font-bold text-white">
                    x{inventory[res.id]}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Inventory Summary */}
            <div className="bg-slate-700 p-4 rounded-xl border-2 border-black/20">
              <h4 className="text-gray-400 text-xs font-bold uppercase mb-3">Inventory</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Object.entries(inventory).map(([key, count]) => {
                  if (count === 0) return null
                  const res = RESOURCES.find((r) => r.id === key)
                  return (
                    <div
                      key={key}
                      className="shrink-0 bg-slate-600 px-3 py-2 rounded-lg flex items-center gap-2 border-b-2 border-black/20"
                    >
                      <span>{res?.icon}</span>
                      <span className="text-white font-bold text-sm">{count}</span>
                    </div>
                  )
                })}
                {Object.values(inventory).every((c) => c === 0) && (
                  <span className="text-gray-500 text-sm italic">Empty inventory... start mining!</span>
                )}
              </div>
            </div>
          </div>

          {/* Crafting Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Hammer className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-200 font-bold uppercase tracking-wider text-sm">Crafting Table</h3>
            </div>

            <div className="space-y-3">
              {RECIPES.map((recipe) => {
                const canCraft = recipe.ingredients.every((ing) => inventory[ing.resource] >= ing.count)
                return (
                  <div
                    key={recipe.id}
                    className="bg-slate-700 p-4 rounded-xl border-b-4 border-black/20 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center border-2 border-black/20">
                        {recipe.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{recipe.name}</h4>
                        <div className="flex gap-2 mt-1">
                          {recipe.ingredients.map((ing) => {
                            const res = RESOURCES.find((r) => r.id === ing.resource)
                            const hasEnough = inventory[ing.resource] >= ing.count
                            return (
                              <span
                                key={ing.resource}
                                className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                  hasEnough ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                                }`}
                              >
                                {ing.count} {res?.name.split(" ")[0]}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={canCraft ? "primary" : "secondary"}
                      className={canCraft ? "bg-green-600 border-green-800 hover:bg-green-500" : "opacity-50"}
                      onClick={() => craftItem(recipe)}
                      disabled={!canCraft}
                    >
                      Craft
                    </Button>
                  </div>
                )
              })}
            </div>

            {/* Crafted Items Display */}
            <div className="bg-slate-700 p-4 rounded-xl border-2 border-black/20 min-h-[100px]">
              <h4 className="text-gray-400 text-xs font-bold uppercase mb-3">Your Builds</h4>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(craftedItems).map(([key, count]) => {
                  if (count === 0) return null
                  const recipe = RECIPES.find((r) => r.id === key)
                  return (
                    <div key={key} className="relative group">
                      <div className="aspect-square bg-slate-600 rounded-lg flex items-center justify-center border-b-4 border-black/20">
                        {recipe?.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-blue-700">
                        {count}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
