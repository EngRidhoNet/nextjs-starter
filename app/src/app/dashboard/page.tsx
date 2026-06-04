"use client"

import { useAuth } from "@context/AuthContext"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { LogOut, User, Building2, Shield } from "lucide-react"

export default function DashboardPage() {
  const { user, workspace, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-bold text-xl text-indigo-600">Winsta AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.fullName}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <User className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle className="text-lg">Profile</CardTitle>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {user.fullName} &middot; {user.isActive ? "Active" : "Inactive"}
              </p>
            </CardContent>
          </Card>

          {workspace && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <div>
                  <CardTitle className="text-lg">Workspace</CardTitle>
                  <p className="text-sm text-gray-500">{workspace.name}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Role: <span className="font-medium capitalize">{workspace.role}</span>
                  {workspace.companyName && <> &middot; {workspace.companyName}</>}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              <div>
                <CardTitle className="text-lg">Getting Started</CardTitle>
                <p className="text-sm text-gray-500">Welcome to Winsta AI</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Your AI-powered marketing dashboard is ready. More features coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
