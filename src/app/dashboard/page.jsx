'use client'

import { useAuth } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Plus, Eye, Download, Trash2 } from 'lucide-react'

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()
  const [resumes, setResumes] = useState([])

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in')
    }
  }, [userId, isLoaded, router])

  useEffect(() => {
    if (userId) {
      fetchResumes()
    }
  }, [userId])

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes')
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    }
  }

  const deleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setResumes(resumes.filter(resume => resume._id !== id))
      } else {
        alert('Failed to delete resume')
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
      alert('Error deleting resume')
    }
  }

  if (!isLoaded || !userId) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">ResuMate</h1>
              </Link>
              <h4 className='mt-1'>&nbsp;&nbsp;Dashboard</h4>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/builder/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Resume
                </Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Resumes</h2>
            {resumes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                  <p className="text-gray-500 mb-6">Create your first resume to get started.</p>
                  <Button asChild>
                    <Link href="/builder/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Resume
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume) => (
                  <Card key={resume._id.toString()} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{resume.title}</CardTitle>
                      <CardDescription>Last modified {new Date(resume.updatedAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/builder/${resume._id.toString()}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/builder/${resume._id.toString()}/preview`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/api/export/${resume._id.toString()}`}>
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteResume(resume._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
