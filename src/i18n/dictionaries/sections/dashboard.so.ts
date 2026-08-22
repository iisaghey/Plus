import type { DashboardDictionary } from "./dashboard.en";

const dashboard: DashboardDictionary = {
  home: {
    signedInAs: "Waxaad ku gashan tahay",
    openPanel: "Fur →",
    panels: {
      superAdmin: {
        label: "Bogga Maamulaha",
        description: "Maamul shaqaalaha, tafatirayaasha, xaqiijinta, iyo dejinta madasha.",
      },
      admin: {
        label: "Bogga Maamulaha",
        description: "Dib u eeg ansixinta akoonnada iyo xaqiijinta profaylada.",
      },
      editor: {
        label: "Bogga Tafatiraha",
        description: "Dib u eeg profaylada la gudbiyay oo maamul waxa-ku-jira.",
      },
      staff: {
        label: "Bogga Shaqaalaha",
        description: "Dhis qabyo-profayl oo la soco hawlaha lagugu xilsaaray.",
      },
    },
    pendingApprovalTitle: "Akoonkaagu wuxuu sugayaa ansixin",
    pendingApprovalDescription:
      "Xubin ka mid ah kooxdayadu waxay dib u eegtaa akoonnada cusub ka hor inta aadan samayn profayl. Sida caadiga ah way degdegtaa — soo noqo dhawaan.",
    rejectedTitle: "Akoonkaaga lama ansixin",
    rejectedDescription: "La xiriir kooxda taageerada haddii aad u malaynayso in tani khalad tahay.",
    contactSupport: "La Xiriir Taageerada",
    noProfileTitle: "Weli ma aadan samayn profaylkaaga",
    noProfileDescription:
      "Ku dar magacaaga, cinwaankaaga, iyo taariikh-nolosheeda si aad u daabacdo profaylkaaga dhijitaalka ah ee AqoonsiPlus.",
    createProfileCta: "Samee Profaylkaaga",
    verifiedBadge: "La Xaqiijiyay",
    verificationPendingBadge: "Xaqiijin Sugaysa",
    noPositionYet: "Weli jago lama darin",
    editProfileCta: "Wax ka beddel Profaylka",
    viewPublicProfileCta: "Eeg Profaylka Dadweynaha",
    profileCompletion: "Dhammaystirka Profaylka",
    completeProfileHint: "Ku dar qaybo, urur, goobta, iyo sawir si aad u dhammaystirto profaylkaaga.",
    verificationRejectedHint: "Codsigaagii xaqiijinta ee ugu dambeeyay lama ansixin. Waad soo gudbin kartaa mar kale.",
    verificationReadyHint: "Ma diyaar u tahay inaad heshid summad la xaqiijiyay? Gudbi profaylkaaga si loo eego.",
    moreSectionsTitle: "Taariikhda shaqada, guulaha, warbaahinta & dukumentiyada",
    moreSectionsDescription:
      "Tafatirayaal gaar ah oo qaybahan loogu talagalay ayaa iman doona wajiga xiga. Profaylkaaga aasaasiga ahi wuu shaqeeyaa",
  },
  profile: {
    lockedMessages: {
      submitted: "Profaylkaaga waa la gudbiyay waxaana la sugayaa in la eego.",
      underReview: "Tafatire ayaa hadda dib u eegaya profaylkaaga.",
      editorApproved: "Profaylkaagu wuxuu ka gudbay dib-u-eegista tafatiraha waxaana la sugayaa ansixinta maamulaha.",
      adminReview: "Maamule ayaa hadda dib u eegaya profaylkaaga.",
      approved: "Profaylkaaga waa la ansixiyay waxaana ku jira safka daabacaadda.",
      verified: "Profaylkaaga waa la xaqiijiyay waxaana ku jira safka daabacaadda.",
      published: "Profaylkaagu waa firfircoon yahay. La xiriir taageerada haddii aad u baahato inaad wax ka beddesho.",
      suspended: "Profaylkaaga waa la joojiyay. La xiriir taageerada si aad wax badan u ogaato.",
      archived: "Profaylkaaga waa la kaydiyay mana laga tafatiri karo halkan hadda.",
    },
    lockedFallback: "Profaylkaaga hadda lama tafatiri karo.",
    steps: {
      identity: "Shakhsi & Xiriir",
      background: "Taariikh-nololeed & Waxbarasho",
      career: "Xirfad & Jagooyin",
      recognition: "Guulo & Hawlo",
      speeches: "Khudbado",
      media: "Warbaahin & Dukumenti",
      review: "Dib u eeg & Gudbi",
    },
    backToDashboard: "Ku noqo Dashboard-ka",
    createHeading: "Samee Profaylkaaga",
    createSubheading:
      "Ka bilow waxyaabaha aasaasiga ah — waxaad ka dari kartaa taariikhda shaqada, guulaha, warbaahinta, iyo dukumentiyada dashboard-kaaga ka dib.",
    createSubmitLabel: "Samee Profayl",
    editHeading: "Wax ka beddel Profaylkaaga",
    editSubheading: "U gudub qayb kasta xawli aad u dul socoto — wax walba way is kaydiyaan intaad socotid.",
    saveChangesLabel: "Kaydi Isbeddellada",
  },
  notifications: {
    title: "Ogeysiisyada",
  },
  notificationList: {
    empty: "Weli ogeysiis ma jiro.",
  },
  pagination: {
    total: "guud ahaan",
  },
  staffDraftForm: {
    newDraft: "Qabyo Cusub",
    modalTitle: "Samee Profayl Cusub",
    fullName: "Magaca Buuxa",
    preferredTitle: "Cinwaanka La Doorbiday",
    preferredTitlePlaceholder: "Dr., Eng., Mudane...",
    profession: "Xirfadda",
    currentPosition: "Jagada Hadda",
    category: "Qaybta",
    organization: "Ururka",
    country: "Dalka",
    location: "Goobta",
    locationPlaceholder: "Magaalada, Dalka",
    nationality: "Jinsiyadda",
    email: "Iimayl",
    phone: "Telefoon",
    phonePlaceholder: "+252...",
    website: "Bogga Internetka",
    shortBio: "Taariikh-nolosheed Kooban",
    shortBioPlaceholder: "Kooban oo ku muuqda kaadhka profaylka…",
    profilePhotoLabel: "Sawirka Profaylka *",
    photoRequiredHint: "Sawir profayl ayaa loo baahan yahay si loo sameeyo profaylka.",
    preparingUpload: "Waxaa la diyaarinayaa soo dejinta sawirka…",
    createProfileSubmit: "Samee Profayl",
    none: "Wax ma jiro",
  },
  submitReviewButton: {
    buttonLabel: "Gudbi si Loo Eego",
    successToast: "Waa loo gudbiyay dib-u-eegis",
  },
};

export default dashboard;
