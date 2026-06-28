import Link from 'next/link'
import { BRAND } from '@/lib/brand'

export default function TermsPage() {
  return (
    <section className="section bg-white">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose text-text-secondary space-y-4">
          <p>
            By using the website and services of {BRAND.title}, you agree to these Terms of Service.
            Please read them carefully before using our platform.
          </p>
          <h2 className="text-xl font-semibold text-text-primary mt-8">Use of Services</h2>
          <p>
            Our online booking and information services are provided for your convenience.
            Appointment confirmations are subject to availability and clinic verification.
          </p>
          <h2 className="text-xl font-semibold text-text-primary mt-8">Medical Disclaimer</h2>
          <p>
            Information on this website is for general purposes only and does not constitute medical advice.
            Always consult a qualified healthcare professional for medical decisions.
          </p>
          <h2 className="text-xl font-semibold text-text-primary mt-8">Contact</h2>
          <p>
            Questions about these terms? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
