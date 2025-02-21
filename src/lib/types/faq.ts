export interface FAQItem {
    question: string;
    answer: string;
    isOpen: boolean;
}

export interface FAQSection {
    title: string;
    items: FAQItem[];
}

export const FAQ_SECTIONS: FAQSection[] = [
    {
        title: "General Questions",
        items: [
            {
                question: "What is First Spark?",
                answer: "First Spark is a platform that helps connect students with mentors.",
                isOpen: false
            }
            // Add more FAQ items as needed
        ]
    }
    // Add more sections as needed
];
