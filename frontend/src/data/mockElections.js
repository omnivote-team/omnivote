const mockElections = [
  {
    id: 1,
    title: "Student Council Election 2026",
    description: "Election for Student Council President for the academic year 2026-2027",
    organization: "University Student Affairs",
    institution: "Springfield University",
    category: "Student Government",
    status: "Ongoing",
    dates: "Voting: March 18 - March 20",
    startDate: "March 18, 2026 at 9:00 AM",
    endDate: "March 20, 2026 at 5:00 PM",
    eligibility: "All verified students of Springfield University",
    rules: [
      "One vote per student",
      "Must be a verified student",
      "Voting is anonymous",
    ],
    candidates: [
      {
        id: 1,
        name: "Alice Johnson",
        description:
          "I will work towards improving student welfare and campus facilities.",
      },
      {
        id: 2,
        name: "Bob Smith",
        description:
          "I promise to bring transparency and accountability to the student council.",
      },
      {
        id: 3,
        name: "Carol Martinez",
        description:
          "My priority is to enhance student engagement through better communication.",
      },
    ],
  },

  {
    id: 2,
    title: "Department Representative Election",
    description: "Election for department student representative.",
    organization: "Computer Science Department",
    institution: "Springfield University",
    category: "Department",
    status: "Upcoming",
    dates: "Voting: March 22 - March 24",
    startDate: "March 22, 2026 at 9:00 AM",
    endDate: "March 24, 2026 at 5:00 PM",
    eligibility: "All verified Computer Science students",
    rules: [
      "One vote per student",
      "Must belong to the Computer Science Department",
      "Voting is anonymous",
    ],
    candidates: [],
  },
];

export default mockElections;