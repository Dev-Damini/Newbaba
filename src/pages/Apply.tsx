import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import Navigation from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Send, CheckCircle, User, Building2, DollarSign, FileText } from 'lucide-react'

export default function Apply() {
  const { grantId } = useParams<{ grantId: string }>()
  const [currentPage, setCurrentPage] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: grant } = trpc.grant.getById.useQuery(
    { id: Number(grantId) },
    { enabled: !!grantId }
  )

  const createApplication = trpc.application.create.useMutation({
    onSuccess: () => {
      setIsSubmitted(true)
    },
  })

  // Form State - Page 1 (Personal + Business)
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    emailAddress: '',
    residentialAddress: '',
  })

  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '',
    businessRegistrationStatus: '',
    businessDescription: '',
    targetMarket: '',
    revenueStrategy: '',
    marketingPlan: '',
    budgetBreakdown: '',
  })

  // Form State - Page 2 (Financial + Documents)
  const [financialInfo, setFinancialInfo] = useState({
    bankAccountDetails: '',
    currentIncome: '',
    expenses: '',
    existingFunding: '',
  })

  const [personalStatement, setPersonalStatement] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleNext = () => {
    if (currentPage === 1) {
      if (!personalInfo.fullName || !personalInfo.dateOfBirth || !personalInfo.phoneNumber || !personalInfo.emailAddress || !personalInfo.residentialAddress) {
        alert('Please fill in all required personal information fields.')
        return
      }
      setCurrentPage(2)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    setCurrentPage(1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions.')
      return
    }

    setIsSubmitting(true)
    try {
      await createApplication.mutateAsync({
        grantId: Number(grantId),
        ...personalInfo,
        ...businessInfo,
        ...financialInfo,
        personalStatement,
      })
    } catch (error) {
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!grant && grantId) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navigation />
        <div className="pt-32 text-center">
          <div className="w-8 h-8 border-3 border-[#1a2a5f] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading grant details...</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 pt-32 pb-16">
          <Card className="text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a2a5f] mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Thank you for submitting your grant application. Your application has been received and is being reviewed by our team.
            </p>
            <p className="text-gray-600 mb-2">
              You will receive a confirmation email shortly at <span className="font-semibold">{personalInfo.emailAddress}</span>.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Expected processing time: <span className="font-semibold text-[#1a2a5f]">2-4 weeks</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button className="bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37]">
                  Browse More Grants
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  Return Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a2a5f] mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Grants
            </Link>

            <div className="bg-gradient-to-br from-[#1a2a5f] to-[#243875] rounded-2xl p-6 text-white">
              <p className="text-[#d4af37] text-sm font-semibold mb-1">Applying for:</p>
              <h1 className="text-xl lg:text-2xl font-bold mb-2">{grant?.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 bg-white/10 rounded-full">
                  Funding: <span className="text-[#d4af37] font-semibold">${Number(grant?.fundingAmount).toLocaleString()}</span>
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full">
                  Type: <span className="text-[#d4af37] font-semibold">{grant?.fundingType?.charAt(0).toUpperCase()}{grant?.fundingType?.slice(1)}</span>
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full">
                  Processing: <span className="text-[#d4af37] font-semibold">{grant?.processingTime}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-[#1a2a5f] text-[#d4af37]' : 'bg-gray-200 text-gray-500'}`}>
              <User className="w-4 h-4" />
              <span className="text-sm font-semibold">Personal & Business</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentPage === 2 ? 'bg-[#1a2a5f] text-[#d4af37]' : 'bg-gray-200 text-gray-500'}`}>
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-semibold">Financial & Review</span>
            </div>
          </div>

          {/* Page 1: Personal + Business Information */}
          {currentPage === 1 && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1a2a5f]">
                    <User className="w-5 h-5 text-[#d4af37]" />
                    Personal Information
                  </CardTitle>
                  <p className="text-sm text-gray-500">Please provide your personal details as they appear on your ID.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name (as per ID) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={personalInfo.phoneNumber}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailAddress">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="emailAddress"
                        type="email"
                        value={personalInfo.emailAddress}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, emailAddress: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residentialAddress">
                      Residential Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="residentialAddress"
                      value={personalInfo.residentialAddress}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, residentialAddress: e.target.value })}
                      placeholder="123 Main Street, City, State, ZIP"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1a2a5f]">
                    <Building2 className="w-5 h-5 text-[#d4af37]" />
                    Business Information
                  </CardTitle>
                  <p className="text-sm text-gray-500">If applying for a business grant, please provide your business details.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={businessInfo.businessName}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                        placeholder="ABC Enterprises LLC"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input
                        id="businessType"
                        value={businessInfo.businessType}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value })}
                        placeholder="e.g., Fashion, Crypto, Agriculture"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessRegistrationStatus">Registration Status</Label>
                    <Input
                      id="businessRegistrationStatus"
                      value={businessInfo.businessRegistrationStatus}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessRegistrationStatus: e.target.value })}
                      placeholder="e.g., LLC, Corporation, Sole Proprietorship"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      value={businessInfo.businessDescription}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessDescription: e.target.value })}
                      placeholder="Describe your business, products/services, and mission..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetMarket">Target Market</Label>
                    <Textarea
                      id="targetMarket"
                      value={businessInfo.targetMarket}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, targetMarket: e.target.value })}
                      placeholder="Who are your customers? What is your market size?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenueStrategy">Revenue Generation Strategy</Label>
                    <Textarea
                      id="revenueStrategy"
                      value={businessInfo.revenueStrategy}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, revenueStrategy: e.target.value })}
                      placeholder="How does your business generate revenue? What are your revenue streams?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marketingPlan">Marketing Plan</Label>
                    <Textarea
                      id="marketingPlan"
                      value={businessInfo.marketingPlan}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, marketingPlan: e.target.value })}
                      placeholder="How do you plan to market your products/services?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetBreakdown">Budget Breakdown</Label>
                    <Textarea
                      id="budgetBreakdown"
                      value={businessInfo.budgetBreakdown}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, budgetBreakdown: e.target.value })}
                      placeholder="Provide a detailed breakdown of how grant funds will be used..."
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  className="bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37] font-semibold px-8"
                >
                  Continue to Financial Info
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Page 2: Financial Information + Review & Submit */}
          {currentPage === 2 && (
            <div className="space-y-6">
              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1a2a5f]">
                    <DollarSign className="w-5 h-5 text-[#d4af37]" />
                    Financial Information
                  </CardTitle>
                  <p className="text-sm text-gray-500">Provide your financial details to complete the application.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountDetails">Bank Account Details</Label>
                    <Textarea
                      id="bankAccountDetails"
                      value={financialInfo.bankAccountDetails}
                      onChange={(e) => setFinancialInfo({ ...financialInfo, bankAccountDetails: e.target.value })}
                      placeholder="Bank name, account type, routing number..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentIncome">Current Annual Income (if applicable)</Label>
                    <Input
                      id="currentIncome"
                      value={financialInfo.currentIncome}
                      onChange={(e) => setFinancialInfo({ ...financialInfo, currentIncome: e.target.value })}
                      placeholder="e.g., $50,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenses">Monthly/Annual Expenses</Label>
                    <Textarea
                      id="expenses"
                      value={financialInfo.expenses}
                      onChange={(e) => setFinancialInfo({ ...financialInfo, expenses: e.target.value })}
                      placeholder="List your major monthly or annual expenses..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="existingFunding">Existing Funding or Investments</Label>
                    <Textarea
                      id="existingFunding"
                      value={financialInfo.existingFunding}
                      onChange={(e) => setFinancialInfo({ ...financialInfo, existingFunding: e.target.value })}
                      placeholder="Any existing loans, investors, or funding sources..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Personal Statement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1a2a5f]">
                    <FileText className="w-5 h-5 text-[#d4af37]" />
                    Personal Statement / Proposal
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    This is where you convince the grant committee. Explain why you deserve this grant, what makes you different, and how you will use the funds responsibly.
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={personalStatement}
                    onChange={(e) => setPersonalStatement(e.target.value)}
                    placeholder="Write your personal statement here. Explain your goals, why you need this funding, and how it will make a difference..."
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>

              {/* Terms & Submit */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1a2a5f] focus:ring-[#d4af37]"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I confirm that all information provided is accurate and complete to the best of my knowledge. I understand that providing false information may result in disqualification and potential legal action. I agree to the Terms of Service and Privacy Policy of Platinum Grant Access.
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="order-2 sm:order-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37] font-semibold px-8 order-1 sm:order-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
