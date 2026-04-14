/**
 * data.js — Competition & Awards Database
 * 
 * Curated list of global and regional competitions.
 */

export const CompetitionDB = [
  {
    name: "International Biology Olympiad",
    aliases: ["IBO"],
    scope: "International",
    selectivity: "Extreme",
    description: "Top 4 biology students per country. Highly prestigious.",
    tags: ["STEM", "Biology"]
  },
  {
    name: "International Mathematical Olympiad",
    aliases: ["IMO"],
    scope: "International",
    selectivity: "Extreme",
    description: "The premier global math competition for high schoolers.",
    tags: ["STEM", "Math"]
  },
  {
    name: "Regeneron Science Talent Search",
    aliases: ["STS", "Intel STS"],
    scope: "National (US)",
    selectivity: "High",
    description: "Oldest and most prestigious science competition in the US.",
    tags: ["STEM", "Research"]
  },
  {
    name: "DECA International Career Development Conference",
    aliases: ["DECA ICDC"],
    scope: "International",
    selectivity: "Moderate-High",
    description: "Business and marketing competition with thousands of participants.",
    tags: ["Business", "Leadership"]
  },
  {
    name: "Model United Nations",
    aliases: ["MUN"],
    scope: "Variable (Local to International)",
    selectivity: "Variable",
    description: "Simulation of the UN. Selectivity depends on the specific conference (e.g., HMUN is high).",
    tags: ["Social Sciences", "Debate"]
  },
  {
    name: "World Schools Debating Championships",
    aliases: ["WSDC"],
    scope: "International",
    selectivity: "High",
    description: "The global standard for high school parliamentary debate.",
    tags: ["Debate", "Public Speaking"]
  }
];

export const AccomplishmentSearch = {
  find(query) {
    const q = query.toLowerCase();
    return CompetitionDB.find(c => 
      c.name.toLowerCase().includes(q) || 
      c.aliases.some(a => a.toLowerCase().includes(q))
    );
  }
};
