import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureCard from "../components/FeatureCard";
import ElectionCard from "../components/ElectionCard";
import mockFeatures from "../data/mockFeatures";
import mockElections from "../data/mockElections";
import { ShieldCheck, MousePointerClick, BarChart3 } from "lucide-react";

function DashboardPage() {
  return (
    <div className="election-list-page">
      <Navbar />

      <HeroSection />

      <section className="features-section">
        {mockFeatures.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </section>

      <section className="ongoing-elections-section">
        <div className="section-header">
          <h2>Ongoing Elections</h2>
          <a href="/elections">View All</a>
        </div>

        <div className="election-list-container">
          {mockElections
            .filter((election) => election.status === "Ongoing")
            .map((election) => (
              <ElectionCard
                key={election.id}
                title={election.title}
                organization={election.organization}
                status={election.status}
                dates={election.dates}
              />
            ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;