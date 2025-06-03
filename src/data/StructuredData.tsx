const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TruckNav",
  "url": "https://your-domain.com", 
  "logo": "https://your-domain.com/logo.png", 
  "sameAs": [
    "https://www.linkedin.com/company/trucknav",
    "https://twitter.com/trucknav"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-123-4567",
    "contactType": "Customer Service",
    "areaServed": "US",
    "availableLanguage": "English"
  }
};

export default jsonLdOrganization;
