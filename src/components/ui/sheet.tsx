"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const SheetContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => {} })

export function Sheet({ open: controlledOpen, onOpenChange, children }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  
  const setOpen = React.useCallback((value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value)
    }
    onOpenChange?.(value)
  }, [isControlled, onOpenChange])

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

export function SheetTrigger({ asChild, children, className, ...props }: any) {
  const { setOpen } = React.useContext(SheetContext)
  
  const handleClick = (e: React.MouseEvent) => {
    setOpen(true)
    if (children.props?.onClick) {
      children.props.onClick(e)
    }
  }

  if (asChild) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props
    })
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export function SheetPortal({ children }: { children: React.ReactNode }) {
  const { open } = React.useContext(SheetContext)
  return (
    <AnimatePresence>
      {open && children}
    </AnimatePresence>
  )
}

export function SheetOverlay({ className, ...props }: any) {
  const { setOpen } = React.useContext(SheetContext)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-xs",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    />
  )
}

export function SheetContent({ className, side = "right", children, ...props }: any) {
  const { setOpen } = React.useContext(SheetContext)
  
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [setOpen])

  const slideVariants = {
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" }
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" }
    },
    top: {
      initial: { y: "-100%" },
      animate: { y: 0 },
      exit: { y: "-100%" }
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      <SheetOverlay />
      <motion.div
        initial={slideVariants[side as keyof typeof slideVariants].initial}
        animate={slideVariants[side as keyof typeof slideVariants].animate}
        exit={slideVariants[side as keyof typeof slideVariants].exit}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={cn(
          "fixed z-50 bg-background p-6 shadow-lg border-border pointer-events-auto h-full w-full max-w-sm",
          side === "right" && "right-0 border-l",
          side === "left" && "left-0 border-r",
          side === "top" && "top-0 border-b w-full h-auto",
          side === "bottom" && "bottom-0 border-t w-full h-auto",
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors focus:outline-none"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </motion.div>
    </div>
  )
}

export function SheetHeader({ className, ...props }: any) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-left", className)}
      {...props}
    />
  )
}

export function SheetTitle({ className, ...props }: any) {
  return (
    <h2
      className={cn("text-lg font-semibold text-foreground font-display", className)}
      {...props}
    />
  )
}

export function SheetDescription({ className, ...props }: any) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}
