import {
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";

export const SOCIAL_FIELDS = [
  { key: "linkedin", label: "LinkedIn", icon: LinkedinIcon, placeholder: "https://linkedin.com/in/..." },
  { key: "twitter", label: "Twitter / X", icon: TwitterIcon, placeholder: "https://x.com/..." },
  { key: "facebook", label: "Facebook", icon: FacebookIcon, placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram", icon: InstagramIcon, placeholder: "https://instagram.com/..." },
  { key: "youtube", label: "YouTube", icon: YoutubeIcon, placeholder: "https://youtube.com/@..." },
] as const;
