import React, { useEffect, useState } from "react";
import ElectionCard from "./ElectionCard";
import ElectionTabs from "./ElectionTabs";
import ElectionFilters from "./ElectionFilters";
import EmptyState from "./EmptyState";
import API from "../api/api";

function ElectionListContent({ onViewDetails }) {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await API.get("/public/elections/");
        console.log(response.data);
        setElections(response.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load elections.");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const organizations = [
    ...new Set(elections.map((election) => election.organization).filter(Boolean)),
  ];

  const categories = [
    ...new Set(elections.map((election) => election.category).filter(Boolean)),
  ];

  const filteredElections = elections.filter((election) => {
    const electionStatus = election.status?.toLowerCase();

  const displayStatus =
    electionStatus === "open"
      ? "ongoing"
      : electionStatus === "scheduled"
      ? "upcoming"
      : electionStatus === "closed"
      ? "past"
      : electionStatus;

  const matchesTab = displayStatus === activeTab;

    const matchesSearch = election.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesOrganization =
      selectedOrganization === "" ||
      election.organization === selectedOrganization;

    const matchesCategory =
      selectedCategory === "" || election.category === selectedCategory;

    return matchesTab && matchesSearch && matchesOrganization && matchesCategory;
  });

  if (loading) {
    return (
      <div className="election-list-page">
        <div className="election-list-inner">
          <p>Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="election-list-page">
      <div className="election-list-inner">
        <section className="election-list-header">
          <h1>Browse Elections</h1>
          <p>Explore ongoing, upcoming, and past elections.</p>
        </section>

        <ElectionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <ElectionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedOrganization={selectedOrganization}
          setSelectedOrganization={setSelectedOrganization}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          organizations={organizations}
          categories={categories}
        />

        {filteredElections.length > 0 ? (
          <div className="election-cards-container">
            {filteredElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onViewDetails={() => onViewDetails(election)}
              />
            ))}
          </div>
        ) : (
          <div className="election-cards-container no-results-layout">
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
}

export default ElectionListContent;