import EcosystemSection from './EcosystemSection';
import ImpressiveNumbersSection from './ImpressiveNumbersSection';
import MobileAppSection from './MobileAppSection';
import TestimonialsSection from './TestimonialsSection';

export default function AwardsEcosystemSection() {
  return (
    <div className="my-12 space-y-12">
      <EcosystemSection />
      <MobileAppSection />
      <TestimonialsSection />
      <ImpressiveNumbersSection />
    </div>
  );
}
