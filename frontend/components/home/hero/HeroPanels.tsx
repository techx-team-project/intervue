import BannerPanel from './BannerPanel';
import CategoryPanel from './CategoryPanel';

export default function HeroPanels() {
  return (
    <div className="expanded:grid-cols-[410px_minmax(0,1fr)] grid grid-cols-1 gap-2.5">
      <CategoryPanel />
      <BannerPanel />
    </div>
  );
}
