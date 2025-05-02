<script module>
  import Footer from '@/components/global/footer.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/Footer',
    component: Footer,
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story name="Default">
  <Footer />
</Story>
