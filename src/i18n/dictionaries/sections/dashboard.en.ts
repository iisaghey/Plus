const dashboard = {
  home: {
    signedInAs: "Signed in as",
    openPanel: "Open →",
    panels: {
      superAdmin: {
        label: "Admin Panel",
        description: "Manage staff, editors, verification, and platform settings.",
      },
      admin: {
        label: "Admin Panel",
        description: "Review account approvals and profile verifications.",
      },
      editor: {
        label: "Editor Panel",
        description: "Review submitted profiles and manage content.",
      },
      staff: {
        label: "Staff Panel",
        description: "Build profile drafts and track your assigned tasks.",
      },
    },
    pendingApprovalTitle: "Your account is pending approval",
    pendingApprovalDescription:
      "A member of our team reviews new accounts before you can create a profile. This is usually quick — check back soon.",
    rejectedTitle: "Your account was not approved",
    rejectedDescription: "Contact our support team if you believe this was a mistake.",
    contactSupport: "Contact Support",
    noProfileTitle: "You haven't created your profile yet",
    noProfileDescription:
      "Add your name, title, and biography to publish your digital profile on AqoonsiPlus.",
    createProfileCta: "Create Your Profile",
    verifiedBadge: "Verified",
    verificationPendingBadge: "Verification Pending",
    noPositionYet: "No position added yet",
    editProfileCta: "Edit Profile",
    viewPublicProfileCta: "View Public Profile",
    profileCompletion: "Profile Completion",
    completeProfileHint: "Add a category, organization, location, and photo to complete your profile.",
    verificationRejectedHint: "Your last verification request was not approved. You can submit again.",
    verificationReadyHint: "Ready to earn a verified badge? Submit your profile for review.",
    moreSectionsTitle: "Career timeline, achievements, media & documents",
    moreSectionsDescription:
      "Dedicated editors for these sections are coming in the next phase. Your base profile is live at",
  },
  profile: {
    lockedMessages: {
      submitted: "Your profile has been submitted and is waiting to be picked up for review.",
      underReview: "An editor is currently reviewing your profile.",
      editorApproved: "Your profile has passed editorial review and is awaiting admin sign-off.",
      adminReview: "An admin is currently reviewing your profile.",
      approved: "Your profile has been approved and is queued for publishing.",
      verified: "Your profile has been verified and is queued for publishing.",
      published: "Your profile is live. Contact support if you need to make changes.",
      suspended: "Your profile has been suspended. Contact support for details.",
      archived: "Your profile has been archived and can no longer be edited here.",
    },
    lockedFallback: "Your profile can't be edited right now.",
    steps: {
      identity: "Personal & Contact",
      background: "Biography & Education",
      career: "Career & Positions",
      recognition: "Achievements & Activities",
      speeches: "Speeches",
      media: "Media & Documents",
      review: "Review & Submit",
    },
    backToDashboard: "Back to Dashboard",
    createHeading: "Create Your Profile",
    createSubheading:
      "Start with the essentials — you can add your career timeline, achievements, media, and documents from your dashboard afterward.",
    createSubmitLabel: "Create Profile",
    editHeading: "Edit Your Profile",
    editSubheading: "Work through each section at your own pace — everything saves as you go.",
    saveChangesLabel: "Save Changes",
  },
  notifications: {
    title: "Notifications",
  },
  notificationList: {
    empty: "No notifications yet.",
  },
  pagination: {
    total: "total",
  },
  staffDraftForm: {
    newDraft: "New Draft",
    modalTitle: "Create New Profile",
    fullName: "Full Name",
    preferredTitle: "Preferred Title",
    preferredTitlePlaceholder: "Dr., Eng., Hon...",
    profession: "Profession",
    currentPosition: "Current Position",
    category: "Category",
    organization: "Organization",
    country: "Country",
    location: "Location",
    locationPlaceholder: "City, Country",
    nationality: "Nationality",
    email: "Email",
    phone: "Phone",
    phonePlaceholder: "+252...",
    website: "Website",
    shortBio: "Short Biography",
    shortBioPlaceholder: "A brief summary that appears on the profile card…",
    profilePhotoLabel: "Profile Photo *",
    photoRequiredHint: "A profile photo is required to create the profile.",
    preparingUpload: "Preparing photo upload…",
    createProfileSubmit: "Create Profile",
    none: "None",
  },
  submitReviewButton: {
    buttonLabel: "Submit for Review",
    successToast: "Submitted for review",
  },
};

export default dashboard;
export type DashboardDictionary = typeof dashboard;
