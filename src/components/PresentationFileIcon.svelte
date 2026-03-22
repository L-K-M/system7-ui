<script lang="ts">
  import Icon from './Icon.svelte';
  import icon from '../assets/file-presentation.png';

  export let alt = 'Presentation file';
  export let size = 16;
  export let title = '';
  let className = '';

  export { className as class };
</script>

<Icon src={icon} {alt} {size} {title} class={className} />
