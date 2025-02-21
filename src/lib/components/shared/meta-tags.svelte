<script lang="ts">
    import type { MetaTagsProps } from '$lib/types/meta';
    import { PUBLIC_SITE_URL } from '$env/static/public';
    
    // Use $props rune for component props
    let { 
        title, 
        description, 
        canonicalUrl, 
        ogImage 
    }: MetaTagsProps = $props();

    // Derive the full canonical URL using environment variable
    const fullCanonicalUrl = $derived(`${PUBLIC_SITE_URL}${canonicalUrl}`);
</script>

<svelte:head>
    <!-- Essential Meta Tags -->
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={fullCanonicalUrl} />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={fullCanonicalUrl} />
    {#if ogImage}
        <meta property="og:image" content={ogImage} />
    {/if}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {#if ogImage}
        <meta name="twitter:image" content={ogImage} />
    {/if}
</svelte:head>
