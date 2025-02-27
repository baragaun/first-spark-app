<script lang="ts">
    import MetaTags from '$lib/components/shared/meta-tags.svelte';
    import type { PrivacySection } from '$lib/types/privacy';
    
    // Use runes for state management
    const lastUpdated = $state(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }));

    const sections: PrivacySection[] = $state([
        {
            id: 'introduction',
            title: '1. Introduction',
            content: "Welcome to First Spark's Privacy Policy. This document explains how we collect, use, and protect your personal information."
        },
        {
            id: 'information-collection',
            title: '2. Information We Collect',
            content: 'We collect information that you provide directly to us when you:',
            listItems: [
                'Create an account',
                'Use our services',
                'Contact our support team',
                'Participate in surveys or promotions',
                'Communicate with other users'
            ]
        },
        {
            id: 'information-usage',
            title: '3. How We Use Your Information',
            content: 'We use the information we collect to:',
            listItems: [
                'Provide, maintain, and improve our services',
                'Process your transactions',
                'Send you technical notices and support messages',
                'Communicate with you about products, services, and events',
                'Protect against malicious or fraudulent activity'
            ]
        }
    ]);

    // Derived state for section count
    const sectionCount = $derived(sections.length);

    // Effect for tracking page views
    $effect(() => {
        if (typeof window !== 'undefined') {
            console.log(`Privacy Policy viewed at ${new Date().toISOString()}`);
        }
    });
</script>

<MetaTags
    title="Privacy Policy | First Spark"
    description="Learn about how First Spark collects, uses, and protects your personal information."
    canonicalUrl="/privacy-policy"
/>

<section class="policy-container">
    <div class="policy-wrapper">
        <header class="policy-header">
            <h1>Privacy Policy</h1>
            <p class="last-updated">Last updated: {lastUpdated}</p>
            <p class="section-count text-sm text-muted-foreground">
                {sectionCount} sections
            </p>
        </header>
    </div>
</section>

<style lang="postcss">
    .policy-container {
        @apply container mx-auto px-4 py-16;
    }

    .policy-wrapper {
        @apply mx-auto max-w-4xl;
    }

    .policy-header {
        @apply mb-12 text-center;
    }

    .policy-header h1 {
        @apply mb-6 text-5xl font-bold tracking-tight text-primary;
    }

    .last-updated {
        @apply text-muted-foreground;
    }
</style>
