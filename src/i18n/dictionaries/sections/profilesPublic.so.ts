const profilesPublic = {
  leaders: {
    label: "Hoggaamiyeyaasha",
    title: "Hoggaamiyeyaasha Dawladda iyo Siyaasadda",
    description:
      "Profaylada dhijitaalka ah ee la xaqiijiyay ee saraakiisha dawladda iyo hoggaamiyeyaasha siyaasadeed, kuwaas oo ilaalinaya taariikhda hoggaankooda.",
  },
  professionals: {
    label: "Xirfadlayaasha",
    title: "Hoggaamiyeyaasha Ganacsiga, Tacliinta iyo Bulshada Rayidka ah",
    description:
      "Profaylada dhijitaalka ah ee la xaqiijiyay ee xirfadlayaasha dhisaya dhaxalkooda dhijitaalka ah ee AqoonsiPlus.",
  },
  organizations: {
    label: "Ururrada",
    heading: "Machadyada Dawladda",
    description:
      "Sahmi machadyada dawladda iyo hay'adaha dadweynaha ee la xiriira profaylada hoggaanka ee AqoonsiPlus.",
    categories: [
      "Machadyada Dawladda Federaalka",
      "Machadyada Dawladaha Xubnaha Federaalka",
      "Dawladda Gobolka iyo Degmada",
      "Wasaaradaha iyo Xafiisyada Dawladda",
      "Hay'adaha iyo Wakaaladaha Dadweynaha",
    ],
  },
  profilesList: {
    label: "Sahmi Profaylada",
    title: "Dhammaan Profaylada Dhijitaalka ah",
    description:
      "Raadi oo shaandhee profaylada la xaqiijiyay ee hoggaamiyeyaasha, xirfadlayaasha, iyo dadka caanka ah ee qaybo kasta.",
  },
  createProfile: {
    accountCreatedToast: "Akoonkaaga waa la abuuray — aan billowno dhisidda profaylkaaga.",
    checkEmailHeading: "Hubi Iimaylkaaga",
    checkEmailMessagePrefix: "Waxaan u dirnay xiriiriye xaqiijin ah",
    checkEmailMessageSuffix:
      "Xaqiiji akoonkaaga si aad u billowdo dhisidda profaylkaaga dhijitaalka ah.",
    backToSignIn: "Ku Noqo Gelitaanka",
    heading: "Samee Profaylkaaga",
    subtitle: "Bilow dhisidda dhaxalkaaga dhijitaalka ah ee la xaqiijiyay ee AqoonsiPlus.",
    fullNameLabel: "Magaca Buuxa",
    fullNamePlaceholder: "Magacaaga oo buuxa",
    passwordPlaceholder: "Ugu yaraan 8 xaraf",
    submitButton: "Samee Profayl",
    alreadyHaveProfile: "Horeba profayl ma u lahayd?",
    signInLink: "Gal",
  },
  card: {
    verifiedBadge: "La Xaqiijiyay",
  },
  directory: {
    resultsCountSingular: "profayl la helay",
    resultsCountPlural: "profaylo la helay",
    emptyTitle: "Wax profayl ah oo la mid ah raadintaada lama helin",
    emptyDescription: "Isku day inaad beddesho shaandhaynta ama ereyada raadinta.",
  },
  filterBar: {
    searchPlaceholder: "Raadi magac, jago, ama xirfad…",
    allCategories: "Dhammaan Qaybaha",
    allCountries: "Dhammaan Dalalka",
    anyStatus: "Xaalad kasta",
    verified: "La Xaqiijiyay",
    pending: "Sugaya",
    unverified: "Aan La Xaqiijin",
    mostViewed: "Ugu Badan Daawasho",
    newest: "Ugu Dambeeyay",
    nameAZ: "Magaca (A–Z)",
  },
  header: {
    verifiedBadge: "Profayl La Xaqiijiyay",
    pendingBadge: "Xaqiijin Sugaysa",
    websiteAriaLabel: "Website-ka",
    contactButton: "La Xiriir",
  },
  tabs: {
    tabLabels: {
      overview: "Guud ahaan",
      biography: "Taariikh Nololeed",
      career: "Xirfadda",
      positions: "Jagooyinka",
      achievements: "Guulaha",
      activities: "Hawlaha",
      travel: "Safarrada",
      speeches: "Khudbadaha",
      media: "Warbaahinta",
      documents: "Dukumeentiyada",
      timeline: "Taariikhda",
    },
    overview: {
      aboutHeading: "Ku Saabsan",
      noBioSummary: "Wali lama daabicin taariikh nololeed kooban.",
      recentAchievements: "Guulaha Ugu Dambeeyay",
      statCareerMilestones: "Xilliyada Xirfadda",
      statGovernmentPositions: "Jagooyinka Dawladda",
      statAchievements: "Guulaha",
      statMediaDocuments: "Warbaahinta iyo Dukumeentiyada",
    },
    biography: {
      heading: "Taariikh Nololeed",
      empty: "Wali lama daabicin taariikh nololeed.",
    },
    career: {
      empty: "Wali lama daabicin taariikhda xirfadda.",
    },
    positions: {
      empty: "Wali lama daabicin jagooyinka dawladda.",
    },
    achievements: {
      empty: "Wali lama daabicin guulaha.",
    },
    activities: {
      empty: "Wali lama daabicin hawlaha rasmiga ah.",
    },
    travel: {
      empty: "Wali lama daabicin safarrada rasmiga ah.",
    },
    speeches: {
      empty: "Wali lama daabicin khudbadaha.",
    },
    media: {
      empty: "Wali lama daabicin warbaahin.",
    },
    documents: {
      empty: "Wali lama daabicin dukumeentiyo.",
      verifiedBadge: "La Xaqiijiyay",
    },
    timelineKind: {
      career: "Xirfad",
      government: "Dawladnimo",
    },
  },
  qrCode: {
    showAriaLabel: "Tus Koodhka QR",
    modalHeading: "Iskaan Garee si aad u Aragto Profaylka La Xaqiijiyay",
    download: "Soo Deji",
    share: "Wadaag",
    print: "Daabac",
    linkCopied: "Xiriiriyaha profaylka ayaa loo koobiyeeyay",
    adminOnlyNote:
      "Soo dejinta iyo daabacaddu waxay u furan yihiin kaliya Maamulayaasha iyo Maamulayaasha Sare.",
    printDocTitle: "{name} — AqoonsiPlus QR",
    printCaption: "Iskaan garee si aad u aragto profaylka {name} ee la xaqiijiyay",
  },
  shareButton: {
    ariaLabel: "Wadaag profaylka",
    linkCopied: "Xiriiriyaha profaylka ayaa loo koobiyeeyay",
  },
  timeline: {
    empty: "Wali lama daabicin diiwaanno taariikheed.",
    current: "Hadda",
  },
  mediaLightbox: {
    previousAriaLabel: "Hore",
    nextAriaLabel: "Xiga",
    openDocument: "Fur Dukumeenti",
  },
  submitVerification: {
    button: "U Gudbi Xaqiijin",
    successToast: "Waxaa loo gudbiyay xaqiijinta",
  },
};

export default profilesPublic;
