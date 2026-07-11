"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children, delayDuration = 200 }: { children: React.ReactNode, delayDuration?: number }) {
  const [open, setOpen] = React.useState(false)
  let timeout: NodeJS.Timeout

  const handleMouseEnter = () => {
    timeout = setTimeout(() => setOpen(true), delayDuration)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeout)
    setOpen(false)
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { open })
        }
        return child
      })}
    </div>
  )
}

export function TooltipTrigger({ asChild, children, open, ...props }: any) {
  if (asChild) {
    return React.cloneElement(children, props)
  }
  return <span {...props}>{children}</span>
}

export function TooltipContent({ className, children, open, ...props }: any) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background shadow-md",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
