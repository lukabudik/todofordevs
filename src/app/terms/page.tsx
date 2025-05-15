"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-4 text-muted-foreground"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold font-mono mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: May 15, 2025</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to TodoForDevs. These Terms of Service ("Terms") govern your
            access to and use of the TodoForDevs application and website
            (collectively, the "Service"). By accessing or using the Service,
            you agree to be bound by these Terms. If you do not agree to these
            Terms, you may not access or use the Service.
          </p>

          <h2>2. Definitions</h2>
          <p>
            <strong>"TodoForDevs"</strong> (or "we", "us", or "our") refers to
            the operators of the TodoForDevs application and website.
          </p>
          <p>
            <strong>"User"</strong> (or "you" or "your") refers to any
            individual or entity that accesses or uses the Service.
          </p>
          <p>
            <strong>"Content"</strong> refers to any information, text,
            graphics, photos, or other materials uploaded, downloaded, or
            appearing on the Service.
          </p>

          <h2>3. Account Registration</h2>
          <p>
            To use certain features of the Service, you may be required to
            register for an account. You agree to provide accurate, current, and
            complete information during the registration process and to update
            such information to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your password and for all
            activities that occur under your account. You agree to notify us
            immediately of any unauthorized use of your account.
          </p>

          <h2>4. User Content</h2>
          <p>
            You retain ownership of any Content that you submit, post, or
            display on or through the Service. By submitting, posting, or
            displaying Content on or through the Service, you grant us a
            worldwide, non-exclusive, royalty-free license to use, copy,
            reproduce, process, adapt, modify, publish, transmit, display, and
            distribute such Content in any and all media or distribution
            methods.
          </p>
          <p>
            You represent and warrant that: (i) you own the Content posted by
            you on or through the Service or otherwise have the right to grant
            the rights and licenses set forth in these Terms; (ii) the posting
            and use of your Content on or through the Service does not violate
            the privacy rights, publicity rights, copyrights, contract rights,
            intellectual property rights, or any other rights of any person.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>
            You agree not to engage in any of the following prohibited
            activities:
          </p>
          <ul>
            <li>
              Using the Service for any illegal purpose or in violation of any
              local, state, national, or international law.
            </li>
            <li>
              Harassing, threatening, or intimidating other users of the
              Service.
            </li>
            <li>
              Impersonating any person or entity, or falsely stating or
              otherwise misrepresenting your affiliation with a person or
              entity.
            </li>
            <li>
              Interfering with or disrupting the Service or servers or networks
              connected to the Service.
            </li>
            <li>
              Attempting to gain unauthorized access to the Service, other
              accounts, computer systems, or networks connected to the Service.
            </li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of TodoForDevs and its
            licensors. The Service is protected by copyright, trademark, and
            other laws of both the United States and foreign countries.
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with
            any product or service without the prior written consent of
            TodoForDevs.
          </p>

          <h2>7. Open Source</h2>
          <p>
            The TodoForDevs application is open source software, released under
            the MIT License. You are free to use, modify, and distribute the
            software in accordance with the terms of the MIT License.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the
            Service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever and without limitation,
            including but not limited to a breach of the Terms.
          </p>
          <p>
            If you wish to terminate your account, you may simply discontinue
            using the Service, or contact us to request account deletion.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall TodoForDevs, nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential, or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, resulting from (i) your access to or use
            of or inability to access or use the Service; (ii) any conduct or
            content of any third party on the Service; (iii) any content
            obtained from the Service; and (iv) unauthorized access, use, or
            alteration of your transmissions or content, whether based on
            warranty, contract, tort (including negligence), or any other legal
            theory, whether or not we have been informed of the possibility of
            such damage.
          </p>

          <h2>10. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is
            provided on an "AS IS" and "AS AVAILABLE" basis. The Service is
            provided without warranties of any kind, whether express or implied,
            including, but not limited to, implied warranties of
            merchantability, fitness for a particular purpose, non-infringement,
            or course of performance.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will provide
            at least 30 days' notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole
            discretion.
          </p>
          <p>
            By continuing to access or use our Service after any revisions
            become effective, you agree to be bound by the revised terms. If you
            do not agree to the new terms, you are no longer authorized to use
            the Service.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of the United States, without regard to its conflict of law
            provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will
            not be considered a waiver of those rights. If any provision of
            these Terms is held to be invalid or unenforceable by a court, the
            remaining provisions of these Terms will remain in effect.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            support@todofordevs.com.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
