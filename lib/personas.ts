export const FRAMEWORKS = [
    {
        id: "inversion",
        name: "Inversion",
        inspiredBy: "Elon Musk",
        description: "What's the fastest way this fails? Strip to physics-level truth.",
        image: "/personas/elon.jpg",
        tagline: "First Principles",
        color: "#FF9500"
    },
    {
        id: "leverage",
        name: "Leverage Analysis",
        inspiredBy: "Naval Ravikant",
        description: "Find the high-leverage move. If it doesn't scale while you sleep, skip it.",
        image: "/personas/naval.jpg",
        tagline: "Leverage & Wealth",
        color: "#3B82F6"
    },
    {
        id: "user_truth",
        name: "User Truth",
        inspiredBy: "Paul Graham",
        description: "Are you making something people want? Or playing startup?",
        image: "/personas/paul.jpg",
        tagline: "YC Wisdom",
        color: "#A855F7"
    },
    {
        id: "customer_back",
        name: "Customer-Back",
        inspiredBy: "Jeff Bezos",
        description: "Work backwards from what the customer actually needs.",
        image: "/personas/bezos.jpg",
        tagline: "Customer Obsessed",
        color: "#6B7280"
    },
    {
        id: "simplicity",
        name: "Simplicity Filter",
        inspiredBy: "Steve Jobs",
        description: "Remove the clutter. Focus on the one thing that matters.",
        image: "/personas/jobs.jpg",
        tagline: "Design & Taste",
        color: "#FFFFFF"
    },
    {
        id: "contrarian",
        name: "Contrarian Check",
        inspiredBy: "Peter Thiel",
        description: "What does everyone believe that's wrong? Find the secret.",
        image: "/personas/thiel.jpg",
        tagline: "Zero to One",
        color: "#EF4444"
    }
];

// Backward compatibility: alias for components still using PERSONAS
export const PERSONAS = FRAMEWORKS;

export function getFrameworkById(id: string) {
    return FRAMEWORKS.find(f => f.id === id) || FRAMEWORKS[0];
}

// Backward compatibility
export function getPersonaById(id: string) {
    // Support both old persona IDs (elon, naval, etc.) and new framework IDs
    const legacyMap: Record<string, string> = {
        elon: 'inversion',
        naval: 'leverage',
        paul: 'user_truth',
        bezos: 'customer_back',
        jobs: 'simplicity',
        thiel: 'contrarian',
    };
    const frameworkId = legacyMap[id] || id;
    return FRAMEWORKS.find(f => f.id === frameworkId) || FRAMEWORKS[0];
}

export function isValidFramework(id: string): boolean {
    return FRAMEWORKS.some(f => f.id === id);
}

// Backward compatibility
export function isValidPersona(id: string): boolean {
    const legacyIds = ['elon', 'naval', 'paul', 'bezos', 'jobs', 'thiel'];
    return legacyIds.includes(id) || isValidFramework(id);
}
