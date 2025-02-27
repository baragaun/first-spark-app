export interface TermsSection {
    title: string;
    content: string;
    listItems?: string[];
}

export const TERMS_SECTIONS: TermsSection[] = [
    {
        title: "1. Acceptance of Terms",
        content: "By accessing and using First Spark's services, you accept and agree to be bound by the terms and provisions of this agreement."
    },
    {
        title: "2. Use License",
        content: "Permission is granted to temporarily download one copy of the materials (information or software) on First Spark's website for personal, non-commercial transitory viewing only.",
        listItems: [
            "Modify or copy the materials",
            "Use the materials for any commercial purpose",
            "Attempt to decompile or reverse engineer any software",
            "Remove any copyright or proprietary notations",
            "Transfer the materials to another person"
        ]
    },
    {
        title: "3. User Responsibilities",
        content: "As a user of First Spark, you are responsible for:",
        listItems: [
            "Maintaining the confidentiality of your account",
            "All activities that occur under your account",
            "Ensuring your use complies with all applicable laws",
            "Notifying us of any unauthorized use"
        ]
    }
];