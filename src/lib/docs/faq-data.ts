import type { FAQSection } from '$lib/types/faq';

export const FAQ_SECTIONS: FAQSection[] = [
    {
        title: 'For Students',
        items: [
            {
                question: 'How old do I have to be?',
                answer: '13',
                isOpen: false
            },
            {
                question: 'Can I ask a pathfinder for a job?',
                answer: 'No. This violates our rules and will result in a ban.',
                isOpen: false
            },
            {
                question: 'Can I ask a pathfinder about job opportunities I found?',
                answer:
                    "Only discuss specific jobs with pathfinders you're already connected with. They may decline to discuss specific employers, as they aren't career counselors.",
                isOpen: false
            },
            {
                question: 'Can I be my own buddy?',
                answer: 'No. This bypasses safety measures and misrepresents your status.',
                isOpen: false
            },
            {
                question: 'Can my parent be my buddy?',
                answer: 'No. Choose someone else to build your network.',
                isOpen: false
            },
            {
                question: 'Can I fire my buddy?',
                answer:
                    'Yes, at any time. You need to find a new buddy to connect with a new pathfinder or resume a conversation with an existing one.',
                isOpen: false
            },
            {
                question: 'Can I have multiple buddies?',
                answer: 'No, only one buddy at a time. You can change buddies at any time.',
                isOpen: false
            },
            {
                question: "What if I don't like have the courage to ask someone to be my buddy?",
                answer: 'Have First Spark send out an invitation for you.',
                isOpen: false
            }
        ]
    },
    {
        title: 'For Buddies',
        items: [
            {
                question: 'Can I stop being a buddy?',
                answer: 'Yes, you can "resign" as a buddy at any time.',
                isOpen: false
            },
            {
                question: 'What if I miss signs that my friend is in danger?',
                answer:
                    'Report any concerns immediately. Your responsibility is to help protect your friend from online risks. If you notice potential dangers, alert First Spark right away.',
                isOpen: false
            }
        ]
    }
];