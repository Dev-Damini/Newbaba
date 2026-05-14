import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Shield, Lock, Eye, Users, FileText, TrendingUp, DollarSign, CheckCircle, XCircle, Clock,
  Search, ArrowLeft, Edit, Trash2, Plus, BarChart3, Inbox, ChevronDown, ChevronUp
} from 'lucide-react'

export default function Admin() {
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'))
  const [adminCode, setAdminCode] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedApp, setExpandedApp] = useState<number | null>(null)

  // Admin login mutation
  const adminLogin = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('adminToken', data.token)
      setAdminToken(data.token)
      setIsLoggingIn(false)
    },
    onError: (error) => {
      setLoginError(error.message)
      setIsLoggingIn(false)
    },
  })

  // Verify token
  const { data: verifyData } = trpc.admin.verify.useQuery(
    { token: adminToken || '' },
    { enabled: !!adminToken, retry: false }
  )

  const isAuthenticated = !!adminToken && verifyData?.valid

  // Fetch data when authenticated
  const { data: dashboardStats, refetch: refetchStats } = trpc.admin.getDashboardStats.useQuery(
    undefined,
    { enabled: isAuthenticated, refetchInterval: 30000 }
  )

  const { data: allGrants, refetch: refetchGrants } = trpc.admin.listAllGrants.useQuery(
    undefined,
    { enabled: isAuthenticated }
  )

  const { data: allApplications, refetch: refetchApps } = trpc.admin.listApplications.useQuery(
    undefined,
    { enabled: isAuthenticated, refetchInterval: 30000 }
  )

  // Mutations
  const updateAppStatus = trpc.admin.updateApplicationStatus.useMutation({
    onSuccess: () => {
      refetchApps()
      refetchStats()
    },
  })

  const createGrantMutation = trpc.admin.createGrant.useMutation({
    onSuccess: () => {
      refetchGrants()
      setShowCreateGrant(false)
      setCreateGrantData({
        title: '', description: '', category: 'business', fundingAmount: '', fundingType: 'federal',
        eligibility: '', deadline: '', processingTime: '2-4 weeks', isActive: 'active', isInstantFunding: 'no', requirements: [],
      })
    },
  })

  const updateGrantMutation = trpc.admin.updateGrant.useMutation({
    onSuccess: () => {
      refetchGrants()
      setEditingGrant(null)
    },
  })

  const deleteGrantMutation = trpc.admin.deleteGrant.useMutation({
    onSuccess: () => {
      refetchGrants()
      refetchStats()
    },
  })

  const [showCreateGrant, setShowCreateGrant] = useState(false)
  const [editingGrant, setEditingGrant] = useState<any>(null)

  const [createGrantData, setCreateGrantData] = useState({
    title: '', description: '', category: 'business', fundingAmount: '', fundingType: 'federal',
    eligibility: '', deadline: '', processingTime: '2-4 weeks', isActive: 'active', isInstantFunding: 'no', requirements: [] as string[],
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)
    adminLogin.mutate({ code: adminCode })
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
  }

  const handleUpdateStatus = (id: number, status: string) => {
    updateAppStatus.mutate({ id, status: status as any })
  }

  const handleCreateGrant = (e: React.FormEvent) => {
    e.preventDefault()
    createGrantMutation.mutate({
      ...createGrantData,
      category: createGrantData.category as any,
      fundingType: createGrantData.fundingType as any,
      isActive: createGrantData.isActive as any,
      isInstantFunding: createGrantData.isInstantFunding as any,
      fundingAmount: createGrantData.fundingAmount,
    })
  }

  const handleUpdateGrant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGrant) return
    updateGrantMutation.mutate({
      id: editingGrant.id,
      ...editingGrant,
      category: editingGrant.category as any,
      fundingType: editingGrant.fundingType as any,
      fundingAmount: String(editingGrant.fundingAmount),
    })
  }

  const handleDeleteGrant = (id: number) => {
    if (confirm('Are you sure you want to delete this grant?')) {
      deleteGrantMutation.mutate({ id })
    }
  }

  // Filter applications
  const filteredApplications = allApplications?.filter((app) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      app.fullName.toLowerCase().includes(q) ||
      app.emailAddress.toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q)
    )
  }) || []

  const formatAmount = (amount: string | number) => {
    const num = Number(amount)
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
    return `$${num.toLocaleString()}`
  }

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#1a2a5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#d4af37]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#1a2a5f]">Staff Access</CardTitle>
            <p className="text-sm text-gray-500">
              Authorized personnel only. Please enter your admin access code.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminCode" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Access Code
                </Label>
                <Input
                  id="adminCode"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code"
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-500 text-center">{loginError}</p>
              )}
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37] font-semibold"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
              <div className="text-center pt-2">
                <Link to="/" className="text-sm text-gray-500 hover:text-[#1a2a5f] inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  Back to Website
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-[#1a2a5f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#d4af37] rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#1a2a5f]" />
              </div>
              <span className="font-bold text-[#d4af37]">Staff Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                View Website
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#1a2a5f] data-[state=active]:text-[#d4af37]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-[#1a2a5f] data-[state=active]:text-[#d4af37]">
              <Inbox className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="grants" className="data-[state=active]:bg-[#1a2a5f] data-[state=active]:text-[#d4af37]">
              <FileText className="w-4 h-4 mr-2" />
              Manage Grants
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#d4af37]/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#d4af37]" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#1a2a5f]">{dashboardStats?.totalGrants || 0}</p>
                        <p className="text-xs text-gray-500">Total Grants</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#1a2a5f]">{dashboardStats?.activeGrants || 0}</p>
                        <p className="text-xs text-gray-500">Active Grants</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#1a2a5f]">{dashboardStats?.totalApplications || 0}</p>
                        <p className="text-xs text-gray-500">Total Applications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#1a2a5f]">
                          {dashboardStats ? formatAmount(dashboardStats.totalFunding) : '$0'}
                        </p>
                        <p className="text-xs text-gray-500">Total Funding Pool</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-6 text-center">
                    <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#1a2a5f]">{dashboardStats?.pendingApplications || 0}</p>
                    <p className="text-xs text-gray-500">Pending Review</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#1a2a5f]">{dashboardStats?.approvedApplications || 0}</p>
                    <p className="text-xs text-gray-500">Approved</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="pt-6 text-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#1a2a5f]">
                      {dashboardStats?.totalApplications ?
                        Math.round((dashboardStats.approvedApplications / dashboardStats.totalApplications) * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-500">Approval Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#1a2a5f]">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {allApplications && allApplications.length > 0 ? (
                    <div className="space-y-3">
                      {allApplications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#1a2a5f]/10 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-[#1a2a5f]" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-[#1a2a5f]">{app.fullName}</p>
                              <p className="text-xs text-gray-500">{app.emailAddress}</p>
                            </div>
                          </div>
                          <Badge className={
                            app.status === 'approved' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            app.status === 'reviewing' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No applications yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-[#1a2a5f]">All Applications</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search applications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredApplications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No applications found.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <div key={app.id} className="border border-gray-100 rounded-xl overflow-hidden">
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#1a2a5f]/10 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-[#1a2a5f]" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#1a2a5f]">{app.fullName}</p>
                              <p className="text-xs text-gray-500">{app.emailAddress} &middot; {app.phoneNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={
                              app.status === 'approved' ? 'bg-green-100 text-green-700' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              app.status === 'reviewing' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                            {expandedApp === app.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {expandedApp === app.id && (
                          <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                            <div className="pt-4 grid sm:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 mb-1">Date of Birth</p>
                                <p className="font-medium">{app.dateOfBirth}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Address</p>
                                <p className="font-medium">{app.residentialAddress}</p>
                              </div>
                              {app.businessName && (
                                <>
                                  <div>
                                    <p className="text-gray-500 mb-1">Business</p>
                                    <p className="font-medium">{app.businessName} ({app.businessType})</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 mb-1">Registration</p>
                                    <p className="font-medium">{app.businessRegistrationStatus}</p>
                                  </div>
                                </>
                              )}
                              {app.currentIncome && (
                                <div>
                                  <p className="text-gray-500 mb-1">Income</p>
                                  <p className="font-medium">{app.currentIncome}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-gray-500 mb-1">Applied</p>
                                <p className="font-medium">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</p>
                              </div>
                            </div>

                            {app.personalStatement && (
                              <div className="mt-4">
                                <p className="text-gray-500 mb-1">Personal Statement</p>
                                <p className="text-sm bg-white p-3 rounded-lg border">{app.personalStatement}</p>
                              </div>
                            )}

                            {/* Status Actions */}
                            <div className="mt-4 flex flex-wrap gap-2">
                              <p className="text-sm font-semibold text-gray-700 w-full mb-1">Update Status:</p>
                              {['pending', 'reviewing', 'approved', 'rejected'].map((status) => (
                                <Button
                                  key={status}
                                  size="sm"
                                  variant={app.status === status ? 'default' : 'outline'}
                                  onClick={() => handleUpdateStatus(app.id, status)}
                                  disabled={updateAppStatus.isPending}
                                  className={app.status === status ? 'bg-[#1a2a5f] text-[#d4af37]' : ''}
                                >
                                  {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                  {status === 'reviewing' && <Eye className="w-3 h-3 mr-1" />}
                                  {status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grants Management Tab */}
          <TabsContent value="grants">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1a2a5f]">Manage Grants</h2>
                <Button
                  onClick={() => setShowCreateGrant(true)}
                  className="bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Grant
                </Button>
              </div>

              {/* Create Grant Form */}
              {showCreateGrant && (
                <Card className="border-[#d4af37]/30">
                  <CardHeader>
                    <CardTitle className="text-[#1a2a5f]">Add New Grant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateGrant} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Input
                            value={createGrantData.title}
                            onChange={(e) => setCreateGrantData({ ...createGrantData, title: e.target.value })}
                            placeholder="Grant title"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Funding Amount *</Label>
                          <Input
                            value={createGrantData.fundingAmount}
                            onChange={(e) => setCreateGrantData({ ...createGrantData, fundingAmount: e.target.value })}
                            placeholder="e.g., 1000000"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={createGrantData.description}
                          onChange={(e) => setCreateGrantData({ ...createGrantData, description: e.target.value })}
                          placeholder="Grant description"
                          required
                        />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Category *</Label>
                          <Select
                            value={createGrantData.category}
                            onValueChange={(v) => setCreateGrantData({ ...createGrantData, category: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['business', 'education', 'housing', 'healthcare', 'technology', 'agriculture', 'community', 'research', 'arts', 'nonprofit', 'emergency', 'personal'].map((c) => (
                                <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Funding Type *</Label>
                          <Select
                            value={createGrantData.fundingType}
                            onValueChange={(v) => setCreateGrantData({ ...createGrantData, fundingType: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['federal', 'state', 'private', 'corporate'].map((t) => (
                                <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={createGrantData.isActive}
                            onValueChange={(v) => setCreateGrantData({ ...createGrantData, isActive: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Eligibility *</Label>
                        <Textarea
                          value={createGrantData.eligibility}
                          onChange={(e) => setCreateGrantData({ ...createGrantData, eligibility: e.target.value })}
                          placeholder="Who is eligible for this grant?"
                          required
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Deadline</Label>
                          <Input
                            type="date"
                            value={createGrantData.deadline}
                            onChange={(e) => setCreateGrantData({ ...createGrantData, deadline: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Processing Time</Label>
                          <Input
                            value={createGrantData.processingTime}
                            onChange={(e) => setCreateGrantData({ ...createGrantData, processingTime: e.target.value })}
                            placeholder="e.g., 2-4 weeks"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={createGrantMutation.isPending}
                          className="bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37]"
                        >
                          {createGrantMutation.isPending ? 'Creating...' : 'Create Grant'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateGrant(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Edit Grant Form */}
              {editingGrant && (
                <Card className="border-blue-300">
                  <CardHeader>
                    <CardTitle className="text-[#1a2a5f]">Edit Grant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateGrant} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Input
                            value={editingGrant.title}
                            onChange={(e) => setEditingGrant({ ...editingGrant, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Funding Amount *</Label>
                          <Input
                            value={editingGrant.fundingAmount}
                            onChange={(e) => setEditingGrant({ ...editingGrant, fundingAmount: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={editingGrant.description}
                          onChange={(e) => setEditingGrant({ ...editingGrant, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Category *</Label>
                          <Select
                            value={editingGrant.category}
                            onValueChange={(v) => setEditingGrant({ ...editingGrant, category: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['business', 'education', 'housing', 'healthcare', 'technology', 'agriculture', 'community', 'research', 'arts', 'nonprofit', 'emergency', 'personal'].map((c) => (
                                <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Funding Type *</Label>
                          <Select
                            value={editingGrant.fundingType}
                            onValueChange={(v) => setEditingGrant({ ...editingGrant, fundingType: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['federal', 'state', 'private', 'corporate'].map((t) => (
                                <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={editingGrant.isActive}
                            onValueChange={(v) => setEditingGrant({ ...editingGrant, isActive: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Eligibility *</Label>
                        <Textarea
                          value={editingGrant.eligibility}
                          onChange={(e) => setEditingGrant({ ...editingGrant, eligibility: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={updateGrantMutation.isPending}
                          className="bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37]"
                        >
                          {updateGrantMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingGrant(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Grants List */}
              <div className="space-y-3">
                {allGrants?.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#1a2a5f] truncate">{g.title}</h4>
                        <Badge className={
                          g.isActive === 'active' ? 'bg-green-100 text-green-700' :
                          g.isActive === 'inactive' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {g.isActive}
                        </Badge>
                        {g.isInstantFunding === 'yes' && (
                          <Badge className="bg-[#d4af37]/10 text-[#d4af37]">Instant</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{formatAmount(g.fundingAmount)}</span>
                        <span>&middot;</span>
                        <span className="capitalize">{g.category}</span>
                        <span>&middot;</span>
                        <span className="capitalize">{g.fundingType}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingGrant(g)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteGrant(g.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
