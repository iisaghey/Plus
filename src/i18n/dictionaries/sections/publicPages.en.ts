const publicPages = {
  about: {
    sectionLabel: "About AqoonsiPlus",
    heading: "A Trusted Home for Leadership Stories",
    description:
      "AqoonsiPlus is a digital profile and information management platform built to organize, preserve, verify, and professionally present information about political leaders and public officials. We exist to ensure that a leader's professional journey, public service, achievements, and official history are organized and preserved in one digital home.",
    badges: ["Political Leaders", "Government Officials", "Former Public Officials"],
    missionTitle: "Our Mission",
    missionBody:
      "To build, organize, verify, and manage professional digital profiles for political leaders and public officials, bringing their identity, career history, leadership journey, achievements, activities, media, and official records together in one accessible digital home.",
    visionTitle: "Our Vision",
    visionBody:
      "To become a trusted digital home for leadership history, where the professional journeys, achievements, and public service records of leaders are organized, preserved, and accessible for the future.",
    howItWorksLabel: "How AqoonsiPlus Works",
    howItWorksHeading: "From Application to a Living Profile",
    steps: {
      apply: {
        label: "Apply",
        title: "Request Your AqoonsiPlus Profile",
        description:
          "The leader or public official contacts AqoonsiPlus to request the creation of a professional digital profile.",
      },
      collect: {
        label: "Information Collection",
        title: "We Collect Your Information",
        description:
          "We collect the key information needed to build the profile, including personal information, biography, education, career history, government positions, activities & meetings, official travels, speeches, media, documents, and achievements.",
      },
      build: {
        label: "Profile Building",
        title: "We Build Your Digital Profile",
        description:
          "The information collected is organized into a professional digital profile, with each part of the leader's journey presented in its own structured section.",
      },
      review: {
        label: "Review & Verification",
        title: "Review & Verification",
        description:
          "The profile and its information are reviewed. Information requiring verification is checked using supporting documents and available information before the profile is marked as verified.",
      },
      launch: {
        label: "Profile Launch",
        title: "Your Profile Goes Live",
        description:
          "Once the profile is completed and reviewed, it is published and made accessible through a public profile link, verified status, and a unique QR code.",
      },
      update: {
        label: "Continuous Updates",
        title: "Keep Your Profile Updated",
        description:
          "The profile can continue to be updated as new information becomes available, including new positions, achievements, official activities, travels, speeches, photos & videos, and documents.",
      },
    },
    verificationLabel: "How Verification Works",
    verificationHeading: "A Structured, Human-Reviewed Process",
    verificationSteps: {
      identity: {
        title: "Identity Verified",
        description:
          "Profile ownership and identity documents are reviewed against official records.",
      },
      information: {
        title: "Information Reviewed",
        description:
          "Career history, positions, and achievements are cross-checked for accuracy.",
      },
      profile: {
        title: "Profile Verified",
        description:
          "Approved profiles receive a verified badge with a visible verification date.",
      },
    },
    learnMoreVerification: "Learn More About Verification",
    ourTeam: "Our Team",
    readyHeading: "Ready to preserve your legacy?",
    createProfileCta: "Create Your Profile",
    haveQuestions: "Have questions?",
    contactUs: "Contact us",
  },
  contact: {
    sectionLabel: "Contact",
    heading: "Get in Touch",
    description:
      "Have a question about verification, your profile, or partnering with AqoonsiPlus? Reach out and our team will respond as soon as possible.",
    methods: {
      email: "Email",
      phone: "Phone",
      facebook: "Facebook",
      twitter: "Twitter / X",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      helpCenter: "Help Center",
    },
    helpCenterDescription: "Browse frequently asked questions",
  },
  privacy: {
    sectionLabel: "Legal",
    heading: "Privacy Policy",
    lastUpdated: "Last updated: January 2026",
    sections: {
      collect: {
        title: "Information We Collect",
        body: "We collect information you provide directly when creating a profile — including biographical details, career history, achievements, media, and documents — as well as account information such as your email address.",
      },
      use: {
        title: "How We Use Information",
        body: "Information is used to build, verify, and present your digital profile, to operate the platform securely, and to communicate with you about your account.",
      },
      sharing: {
        title: "Information Sharing",
        body: "Profile information you mark as public is visible to visitors. Private documents and account details are never shared publicly and are protected by role-based access controls.",
      },
      security: {
        title: "Data Security",
        body: "AqoonsiPlus uses Supabase's Postgres database with row-level security, encrypted storage, and role-based permissions to protect your data.",
      },
      rights: {
        title: "Your Rights",
        body: "You may request access to, correction of, or deletion of your personal information at any time by contacting us.",
      },
    },
  },
  terms: {
    sectionLabel: "Legal",
    heading: "Terms of Service",
    lastUpdated: "Last updated: January 2026",
    sections: {
      acceptance: {
        title: "Acceptance of Terms",
        body: "By creating a profile or otherwise using AqoonsiPlus, you agree to these Terms of Service and our Privacy Policy.",
      },
      accountResponsibilities: {
        title: "Account Responsibilities",
        body: "You are responsible for the accuracy of information you submit and for maintaining the security of your account credentials.",
      },
      verification: {
        title: "Verification",
        body: "Verified badges reflect the outcome of AqoonsiPlus's review process and do not constitute an endorsement of any individual or organization.",
      },
      contentStandards: {
        title: "Content Standards",
        body: "Profiles must contain accurate, non-defamatory information. AqoonsiPlus reserves the right to suspend or remove profiles that violate these standards.",
      },
      limitationOfLiability: {
        title: "Limitation of Liability",
        body: "AqoonsiPlus is provided on an as-is basis. We are not liable for decisions made based on information presented on the platform.",
      },
    },
  },
  help: {
    sectionLabel: "Help Center",
    heading: "Frequently Asked Questions",
    faqs: {
      createProfile: {
        q: "How do I create a profile?",
        a: "Click “Create Profile” in the navigation bar, sign up with your email, and you'll be guided through building your digital profile.",
      },
      verification: {
        q: "How does verification work?",
        a: "After creating a profile, you can submit it for review. Our team verifies identity and cross-checks submitted information before granting a verified badge. See the Verification page for details.",
      },
      whoCanSee: {
        q: "Who can see my profile?",
        a: "You control visibility. Public profiles are searchable by anyone; private documents are only visible to you and platform staff.",
      },
      updateProfile: {
        q: "Can I update my profile after it's published?",
        a: "Yes. Profile owners can edit their information at any time from their dashboard.",
      },
      qrCode: {
        q: "How do I get a QR code for my profile?",
        a: "Every public profile automatically generates a QR code, available from the profile page header — you can download, share, or print it.",
      },
      reportIncorrect: {
        q: "How do I report incorrect information?",
        a: "Contact our support team with details of the profile and the correction needed.",
      },
    },
    stillNeedHelp: "Still need help?",
    contactOurTeam: "Contact our team",
  },
  verification: {
    sectionLabel: "Verification",
    heading: "Trust You Can See",
    description:
      "Every verified badge on AqoonsiPlus represents a completed review of identity and information — not a self-reported claim.",
    whatVerificationChecks: "What Verification Checks",
    checks: {
      identity: {
        title: "Identity Verified",
        description:
          "Confirms the profile represents a real individual with a legitimate claim to the identity presented.",
      },
      information: {
        title: "Information Reviewed",
        description:
          "Career history, positions, and achievements are cross-checked against supporting documentation.",
      },
      date: {
        title: "Verification Date",
        description:
          "Every verified profile displays the date its verification was last confirmed.",
      },
      secureProcess: {
        title: "Secure Review Process",
        description:
          "Verification is handled by trained reviewers with role-based access, never exposed publicly.",
      },
    },
    statusesHeading: "Verification Statuses",
    statuses: {
      verified: {
        label: "Verified",
        description:
          "Identity confirmed and information reviewed against supporting records.",
      },
      pending: {
        label: "Pending",
        description:
          "Submitted for review; identity or information checks are in progress.",
      },
      unverified: {
        label: "Unverified",
        description: "Profile has not yet entered the verification process.",
      },
    },
    readyHeading: "Ready to get verified?",
    readyDescription:
      "Create your profile and submit it for review to earn a verified badge on AqoonsiPlus.",
    createProfileCta: "Create Your Profile",
  },
};

export default publicPages;
export type PublicPagesDictionary = typeof publicPages;
