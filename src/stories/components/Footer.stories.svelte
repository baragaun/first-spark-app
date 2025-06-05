<script module>
  import Footer from '@/components/layout/footer.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { within, expect } from '@storybook/test';
  import { m } from '$lib/paraglide/messages.js';

  const { Story } = defineMeta({
    title: 'Components/Footer',
    component: Footer,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story
  name="Default"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check for footer element
    const footer = canvas.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    // Check for copyright text with current year using paraglide message
    const currentYear = new Date().getFullYear();
    const copyrightMessage = m['footer.copyright']({ year: currentYear });
    const copyright = canvas.getByText(copyrightMessage);
    expect(copyright).toBeInTheDocument();

    // Check for navigation links using paraglide message
    const privacyPolicyText = m['footer.navigation.privacy_policy']();
    const privacyPolicyLink = canvas.getByRole('link', { name: privacyPolicyText });
    expect(privacyPolicyLink).toBeInTheDocument();

    // Verify navigation section exists
    const navigation = canvas.getByRole('navigation', { name: /footer navigation/i });
    expect(navigation).toBeInTheDocument();
  }}
>
  <Footer />
</Story>
