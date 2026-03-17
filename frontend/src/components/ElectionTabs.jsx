function ElectionTabs({ activeTab, setActiveTab }) {
  return (
    <section className="election-tabs">
      <button
        className={activeTab === "ongoing" ? "active-tab" : ""}
        onClick={() => setActiveTab("ongoing")}
      >
        Ongoing
      </button>

      <button
        className={activeTab === "upcoming" ? "active-tab" : ""}
        onClick={() => setActiveTab("upcoming")}
      >
        Upcoming
      </button>

      <button
        className={activeTab === "past" ? "active-tab" : ""}
        onClick={() => setActiveTab("past")}
      >
        Past
      </button>
    </section>
  );
}

export default ElectionTabs;