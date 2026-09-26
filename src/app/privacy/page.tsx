import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <main className="relative z-10 min-h-screen" id="main-content">
      <div
        aria-hidden
        className="hero-radials fixed inset-0 pointer-events-none z-0 opacity-40"
      />

      <div className="relative px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
            <p className="text-lg leading-relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Overview
              </h2>
              <p className="leading-relaxed">
                This Privacy Policy governs the manner in which Olog Reader
                collects, uses, maintains and protects information collected
                from users (each, a 'User') of the Olog Reader website and
                application.
              </p>
              <p className="leading-relaxed">
                Olog Reader is committed to protecting your privacy. Should our
                service ask you to provide any information by which you can be
                identified, you may be assured that information will only be
                used in accordance with this Privacy Policy.
              </p>
              <p className="leading-relaxed">
                This Privacy Policy covers any use of our service. Note,
                however, that our service may contain links to other websites of
                interest. As we have no control over such sites, they are not
                governed by this Privacy Policy and we cannot be responsible for
                the protection and privacy of any information which you provide
                to them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Information Collection
              </h2>
              <p className="leading-relaxed">
                We do not collect personal identifiable information from
                visitors who simply visit and browse our website. We may collect
                non-personal identification information about Users whenever
                they interact with Olog Reader. Non-personal identification
                information may include the browser name, the type of computer
                and technical information about Users means of connection to our
                service, such as the operating system and the Internet service
                providers utilized and other similar information.
              </p>
              <p className="leading-relaxed">
                Users can always refuse to supply personally identification
                information, except that it may prevent them from engaging in
                certain service related activities. However, should you choose
                to sign up for an account or make an inquiry, Olog Reader may
                collect the following personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Birthday</li>
                <li>Address information</li>
                <li>Country of origin</li>
                <li>IP address</li>
                <li>Your voice imprint (for audio generation purposes)</li>
                <li>
                  Any answers you provide if you voluntarily choose to
                  participate in customer surveys
                </li>
                <li>
                  Any additional contact information that you voluntarily choose
                  to provide if you interact with our support team
                </li>
              </ul>
              <p className="leading-relaxed">
                In addition, the following technical information may be
                collected in an anonymized format, not linked directly to your
                account:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type and version used to access the service</li>
                <li>Operating system used to access the service</li>
                <li>Referrer URL / Previously visited page</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                How We Use Your Information
              </h2>
              <p className="leading-relaxed">
                Olog Reader requires the information we gather to generally
                understand your needs and to provide you with better service,
                and in particular for the following reasons:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  To customize your experience with our service according to
                  your interests
                </li>
                <li>To enable internal record keeping and reporting</li>
                <li>To improve our products and services</li>
                <li>
                  To periodically send information about new features or other
                  information which we think you may find interesting
                </li>
                <li>
                  To send User information and updates pertaining to their
                  account
                </li>
                <li>
                  To respond to inquiries, questions, and/or other requests
                </li>
                <li>
                  To contact you from time to time for market research purposes
                </li>
              </ul>
              <p className="leading-relaxed">
                If you decide to opt-in to our mailing list, you will receive
                emails that may include company news, updates, related product
                or service information, etc. If at any time you would like to
                unsubscribe from receiving future emails, we include detailed
                unsubscribe instructions at the bottom of each email or you may
                contact us directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Information Security
              </h2>
              <p className="leading-relaxed">
                Olog Reader is committed to ensuring that your information is
                secure. To prevent unauthorized access or disclosure, we have
                put in place suitable physical, electronic, and managerial
                procedures to safeguard and secure the information we collect
                online.
              </p>
              <p className="leading-relaxed">
                We adopt appropriate data collection, storage and processing
                practices and security measures to protect against unauthorized
                access, alteration, disclosure or destruction of your personal
                information, username, password, transaction information and
                data stored on our service.
              </p>
              <p className="leading-relaxed">
                We also adhere to the principles of purpose limitation and data
                minimization. Therefore, we only store your personal data for as
                long as it is necessary to achieve the purposes mentioned here
                or as long as the storage periods required by law. After
                discontinuation of the respective purpose or expiry of these
                deadlines, the corresponding data will be blocked or deleted in
                accordance with the statutory provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Information Sharing
              </h2>
              <p className="leading-relaxed">
                We do not sell, trade, or rent Users personal identification
                information to others. We may share generic aggregated
                demographic information not linked to any personal
                identification information regarding visitors and users with our
                business partners, trusted affiliates and advertisers for the
                purposes outlined above.
              </p>
              <p className="leading-relaxed">
                Olog Reader will not sell, distribute, or lease your personal
                information to third parties unless we have your permission or
                are required by law to do so.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Information Control & Your Rights
              </h2>
              <p className="leading-relaxed">
                You have the right to request a copy of your information, to
                object to our use of your information (including for marketing
                purposes), and to request the deletion or restriction of your
                information. Olog Reader will respond to requests about these
                matters within a reasonable timeframe.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Accessing and updating your information
              </h3>
              <p className="leading-relaxed">
                Should you wish to access or update any of your information, you
                can contact us through our website or by email at
                contact@olog.me. Likewise, you have the right to contact us and
                request an electronic file with a copy of your information.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Opting out of communications
              </h3>
              <p className="leading-relaxed">
                You may opt out of receiving communications from us by using the
                unsubscribe link within each email, by updating your email
                preferences within our service, or by contacting us at
                contact@olog.me.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Cookies
              </h3>
              <p className="leading-relaxed">
                Cookies are small files which can be placed on your computer's
                hard drive to allow websites to respond to you as an individual.
                Within our service, we use traffic log cookies to identify which
                pages are being used. We only use this information for
                statistical analysis purposes, then remove the data from our
                system. The cookies in no way gives us access to your computer
                or any information about you, other than the data you choose to
                share with us. Most web browsers automatically accept cookies,
                but you can change your browser setting to decline cookies if
                you prefer. Please be aware that if you choose to decline
                cookies, some or all of our service may be inaccessible or
                non-functional.
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">
                Right to be forgotten
              </h3>
              <p className="leading-relaxed">
                If you no longer want Olog Reader to continue storing
                information about you, you may contact us and request that your
                account be forgotten. When we receive such a request, we will
                retain your data for 30 days. If you change your mind during
                this period, you can contact us again to stop the process of
                being forgotten. If you have not contacted us within 30 days,
                your account will be permanently forgotten.
              </p>

              <p className="leading-relaxed">
                You have the right to complain about any improper processing of
                your personal data (such as collection, storage, modification,
                transfer, deletion, etc.) by us to the proper authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Changes to This Policy
              </h2>
              <p className="leading-relaxed">
                We reserve the right to change this Privacy Policy from time to
                time to ensure that it complies with current legal requirements
                or to implement changes to our services. Any such changes will
                be posted to our website and service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this privacy policy, please
                contact us at contact@olog.me
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
