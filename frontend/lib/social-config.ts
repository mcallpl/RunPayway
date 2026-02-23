export const RUNPAYWAY_SOCIAL = {
  x_handle: "REPLACE_ME",
  linkedin_slug: "REPLACE_ME",
  facebook_handle: "REPLACE_ME",
  instagram_handle: "REPLACE_ME",
} as const;

export function getSocialLinks() {
  return {
    x: `https://x.com/${RUNPAYWAY_SOCIAL.x_handle}`,
    linkedin: `https://www.linkedin.com/company/${RUNPAYWAY_SOCIAL.linkedin_slug}/`,
    facebook: `https://www.facebook.com/${RUNPAYWAY_SOCIAL.facebook_handle}/`,
    instagram: `https://www.instagram.com/${RUNPAYWAY_SOCIAL.instagram_handle}/`,
  };
}
