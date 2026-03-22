<script lang="ts">
  import Icon from './Icon.svelte';
  import icon from '../assets/file-text.png';

  export let alt = 'Text file';
  export let size = 16;
  export let title = '';
  let className = '';

  export { className as class };
</script>

<Icon src={icon} {alt} {size} {title} class={className} />
