<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Footer from '$lib/components/footer.svelte';

  const { Story } = defineMeta({
    title: 'Components/Footer',
    component: Footer,
  });
</script>

<Story name="Default">
  <Footer />
</Story>
