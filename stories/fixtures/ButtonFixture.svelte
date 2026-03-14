<script lang="ts">
  import Button from '../../src/components/Button.svelte';

  export let variant: 'default' | 'primary' | 'icon' = 'default';
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let title = '';
  export let label = 'System 7 Button';
</script>

<Button {variant} {disabled} {type} {title}>
  {label}
</Button>
