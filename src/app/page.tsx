import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";
import HeroDark from "@/components/home/HeroDark";
import RegulatoryStrip from "@/components/home/RegulatoryStrip";
import PillarsBento from "@/components/home/PillarsBento";
import AIHubDeepDive from "@/components/home/AIHubDeepDive";
import FiberFootprint from "@/components/home/FiberFootprint";
import MetricExplorer from "@/components/home/MetricExplorer";
import InvestorCallout from "@/components/home/InvestorCallout";
import LatestUpdates from "@/components/home/LatestUpdates";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroDark />
        <RegulatoryStrip />
        <PillarsBento />
        <AIHubDeepDive />
        <FiberFootprint />
        <MetricExplorer />
        <InvestorCallout />
        <LatestUpdates />
        <ContactUs />
      </main>
      <Footer />
    </>
  );
}
