import React, { useState } from "react";
import ElectionCard from "./ElectionCard";
import mockElections from "../data/mockElections";
import ElectionTabs from "./ElectionTabs";
import ElectionFilters from "./ElectionFilters";
import EmptyState from "./EmptyState";

function ElectionListContent() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const organizations = [
    ...new Set(mockElections.map((election) => election.organization)),
  ];

  const categories = [
    ...new Set(mockElections.map((election) => election.category)),
  ];

  const filteredElections = mockElections.filter((election) => {
    const matchesTab = election.status.toLowerCase() === activeTab;
    const matchesSearch = election.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesOrganization =
      selectedOrganization === "" ||
      election.organization === selectedOrganization;
    const matchesCategory =
      selectedCategory === "" ||
      election.category === selectedCategory;

    return (
      matchesTab &&
      matchesSearch &&
      matchesOrganization &&
      matchesCategory
    );
  });

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
              <ElectionCard key={election.id} election={election} />
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