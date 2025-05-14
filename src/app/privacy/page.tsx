"use client";

import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold font-mono mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: May 15, 2025</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            TodoForDevs ("we", "us", or "our") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our application and
            website (collectively, the "Service").
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using the
            Service, you acknowledge that you have read, understood, and agree
            to be bound by all the terms of this Privacy Policy. If you do not
            agree with our policies and practices, please do not use our
            Service.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our
            Service:
          </p>

          <h3>2.1 Personal Information</h3>
          <p>
            When you register for an account, we collect personal information
            that you voluntarily provide to us, such as:
          </p>
          <ul>
            <li>Your name</li>
            <li>Email address</li>
            <li>Password (stored in encrypted form)</li>
            <li>Profile information (such as profile picture)</li>
          </ul>

          <h3>2.2 Usage Information</h3>
          <p>
            We automatically collect certain information about how you interact
            with our Service, including:
          </p>
          <ul>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Operating system</li>
            <li>Pages visited and features used</li>
            <li>Time and date of your visits</li>
            <li>Referring website addresses</li>
          </ul>

          <h3>2.3 User Content</h3>
          <p>
            We collect and store the content you create, upload, or receive from
            others when using our Service, such as tasks, projects, comments,
            and other materials.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including
            to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our Service</li>
            <li>Process and complete transactions</li>
            <li>
              Send you technical notices, updates, and administrative messages
            </li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Communicate with you about products, services, and events</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Protect the security and integrity of our Service</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>
            We may share your personal information in the following situations:
          </p>
          <ul>
            <li>
              <strong>With Your Consent:</strong> We may disclose your personal
              information for any purpose with your consent.
            </li>
            <li>
              <strong>With Team Members:</strong> If you are part of a team or
              organization, your information may be visible to other team
              members.
            </li>
            <li>
              <strong>Service Providers:</strong> We may share your information
              with third-party vendors, service providers, contractors, or
              agents who perform services for us.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information where required to do so by law or in response to valid
              requests by public authorities.
            </li>
            <li>
              <strong>Business Transfers:</strong> We may share or transfer your
              information in connection with, or during negotiations of, any
              merger, sale of company assets, financing, or acquisition of all
              or a portion of our business to another company.
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational
            security measures designed to protect the security of any personal
            information we process. However, please also remember that we cannot
            guarantee that the internet itself is 100% secure. Although we will
            do our best to protect your personal information, transmission of
            personal information to and from our Service is at your own risk.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We will retain your personal information only for as long as is
            necessary for the purposes set out in this Privacy Policy. We will
            retain and use your information to the extent necessary to comply
            with our legal obligations, resolve disputes, and enforce our
            policies.
          </p>

          <h2>7. Your Data Protection Rights</h2>
          <p>
            Depending on your location, you may have the following data
            protection rights:
          </p>
          <ul>
            <li>
              The right to access, update, or delete the information we have on
              you.
            </li>
            <li>
              The right of rectification - the right to have your information
              corrected if it is inaccurate or incomplete.
            </li>
            <li>
              The right to object to our processing of your personal data.
            </li>
            <li>
              The right of restriction - the right to request that we restrict
              the processing of your personal information.
            </li>
            <li>
              The right to data portability - the right to request a copy of
              your data in a structured, machine-readable format.
            </li>
            <li>
              The right to withdraw consent at any time where we relied on your
              consent to process your personal information.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at
            privacy@todofordevs.com.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our Service is not intended for use by children under the age of 13.
            We do not knowingly collect personally identifiable information from
            children under 13. If you are a parent or guardian and you are aware
            that your child has provided us with personal information, please
            contact us so that we can take necessary actions.
          </p>

          <h2>9. Third-Party Services</h2>
          <p>
            Our Service may contain links to other websites or services that are
            not operated by us. If you click on a third-party link, you will be
            directed to that third party's site. We strongly advise you to
            review the Privacy Policy of every site you visit. We have no
            control over and assume no responsibility for the content, privacy
            policies, or practices of any third-party sites or services.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date at the top of this Privacy
            Policy. You are advised to review this Privacy Policy periodically
            for any changes. Changes to this Privacy Policy are effective when
            they are posted on this page.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@todofordevs.com.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
