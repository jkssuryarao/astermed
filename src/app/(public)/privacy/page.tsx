import Link from 'next/link'
import { BRAND } from '@/lib/brand'

export default function PrivacyPage() {
  return (
    <section className="section bg-white">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose text-text-secondary space-y-4">
          <p>
            {BRAND.title} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This policy explains how we collect, use, and safeguard your personal information when you use our website and services.
          </p>
          <h2 className="text-xl font-semibold text-text-primary mt-8">Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, and appointment details
            when you book appointments, submit contact forms, or register for an account.
          </p>
          <h2 className="text-xl font-semibold text-text-primary mt-8">How We Use Your Information</h2>
          <p>
            Your information is used to process appointments, respond to inquiries, improve our services,
            and communicate with you about your healthcare needs.
          </p>
          <h2 className="text-xl font-semibold text-text-primary mt-8">Contact</h2>
          <p>
            For privacy-related questions, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}
