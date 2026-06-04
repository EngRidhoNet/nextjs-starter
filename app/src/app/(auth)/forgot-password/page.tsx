"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your email to receive reset instructions</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-500 text-sm">
          <p>Password reset is coming soon.</p>
          <p className="mt-4">
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Back to Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
