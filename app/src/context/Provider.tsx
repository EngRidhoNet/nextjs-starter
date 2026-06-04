/**
 * Root Provider Component
 * Wraps app with all context providers
 */

"use client"

import { ReactNode } from "react"
import { AuthProvider } from "@context/AuthContext"
import { ThemeProvider } from "@context/ThemeContext"
import { I18nProvider } from "@context/I18nContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

