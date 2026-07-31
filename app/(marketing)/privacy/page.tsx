export default function PrivacyPage() {
  const effective = 'July 31, 2026';
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <section style={{ maxWidth: '760px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Legal</div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '3rem' }}>Effective date: {effective}</p>

        {[
          {
            title: '1. Introduction',
            body: `Apex Vital Holdings LLC, doing business as Luminary Financial ("Company," "we," "us," or "our"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Luminary Financial Compliance Intelligence Platform ("Platform").`,
          },
          {
            title: '2. Information We Collect',
            body: `Account Information: When you register, we collect your name, email address, and hashed password.\n\nBilling Information: Payment processing is handled by Stripe. We do not store your full credit card number. We store your Stripe customer ID for billing management.\n\nUsage Data: We collect data about your audit activity, including file names, file sizes, audit timestamps, and finding counts. We do not store the full content of uploaded documents after analysis is complete.\n\nCommunications: If you contact us, we may retain the content of your communications to assist you.`,
          },
          {
            title: '3. How We Use Your Information',
            body: `We use your information to:\n• Provide and operate the Platform\n• Process payments and manage subscriptions\n• Send account-related communications\n• Respond to support requests\n• Analyze usage patterns to improve the Platform\n• Comply with applicable legal obligations\n\nWe do not use your documents or audit content to train AI models. We do not sell your personal data to third parties.`,
          },
          {
            title: '4. Document Data',
            body: `Documents you upload are processed in memory to generate compliance findings. Documents are not permanently stored on our servers after the audit is complete. Audit results (finding counts, severities, and rule citations) are stored in your account history to enable the Audit History feature. You may delete your audit history at any time from your account settings.`,
          },
          {
            title: '5. Data Sharing',
            body: `We share your data only with:\n• Stripe — for payment processing\n• Supabase — for database hosting (your data is stored in a dedicated project)\n• Anthropic — document text is sent to Claude AI for analysis (see Anthropic's privacy policy at anthropic.com)\n• Law enforcement — when required by applicable law\n\nWe do not sell, rent, or trade your personal information.`,
          },
          {
            title: '6. Data Security',
            body: `We implement industry-standard security measures including encrypted connections (TLS), hashed passwords (bcrypt), and access controls. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
          },
          {
            title: '7. Data Retention',
            body: `We retain account information for as long as your account is active. If you close your account, we will delete your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as dispute resolution.`,
          },
          {
            title: '8. Your Rights',
            body: `You have the right to:\n• Access the personal data we hold about you\n• Correct inaccurate data\n• Request deletion of your data\n• Export your audit history\n• Opt out of non-essential communications\n\nTo exercise these rights, contact us at hello@luminaryfinancial.co.`,
          },
          {
            title: '9. Cookies',
            body: `The Platform uses session cookies for authentication purposes only. We do not use tracking cookies, advertising cookies, or third-party analytics beyond basic server-side logging.`,
          },
          {
            title: '10. Children\'s Privacy',
            body: `The Platform is not directed at individuals under 18 years of age. We do not knowingly collect personal information from minors.`,
          },
          {
            title: '11. Changes to This Policy',
            body: `We may update this Privacy Policy from time to time. We will notify registered users of material changes by email. Your continued use of the Platform after changes take effect constitutes acceptance of the updated policy.`,
          },
          {
            title: '12. Contact',
            body: `Privacy questions or requests may be directed to:\nhello@luminaryfinancial.co\nApex Vital Holdings LLC\nAtlanta, GA`,
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.75rem' }}>{section.title}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{section.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
