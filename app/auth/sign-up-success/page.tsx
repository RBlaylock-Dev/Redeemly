import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Welcome to Our Community!</CardTitle>
            <CardDescription className="text-slate-600">Your account has been created successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-slate-700">
                We've sent a confirmation email to your inbox. Please check your email and click the confirmation link
                to activate your account.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Once confirmed, you'll be able to:</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Connect with others on similar journeys</li>
                <li>• Share your testimony and experiences</li>
                <li>• Access exclusive resources and support</li>
                <li>• Join support groups and Bible studies</li>
              </ul>
            </div>
            <div className="pt-4 space-y-2">
              <Button asChild className="w-full bg-sky-600 hover:bg-sky-700">
                <Link href="/auth/login">Continue to Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
