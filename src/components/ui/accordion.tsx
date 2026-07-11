"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
  activeItem: string | null
  toggleItem: (value: string) => void
}>({ activeItem: null, toggleItem: () => {} })

export function Accordion({ children, className, type = "single", ...props }: any) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null)

  const toggleItem = React.useCallback((value: string) => {
    setActiveItem((prev) => (prev === value ? null : value))
  }, [])

  return (
    <AccordionContext.Provider value={{ activeItem, toggleItem }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ value, className, children, ...props }: any) {
  return (
    <div
      className={cn("border-b border-border py-2", className)}
      data-state={value}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { value })
        }
        return child
      })}
    </div>
  )
}

export function AccordionTrigger({ value, className, children, ...props }: any) {
  const { activeItem, toggleItem } = React.useContext(AccordionContext)
  const isOpen = activeItem === value

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-display font-medium text-sm transition-all hover:underline",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
          isOpen && "rotate-180"
        )}
      />
    </button>
  )
}

export function AccordionContent({ value, className, children, ...props }: any) {
  const { activeItem } = React.useContext(AccordionContext)
  const isOpen = activeItem === value

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={cn("pb-4 pt-0 text-sm text-muted-foreground", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
