<script lang="ts">
  import Icon from './Icon.svelte';
  import icon from '../assets/file-audio.png';

  export let alt = 'Audio file';
  export let size = 16;
  export let title = '';
  let className = '';

  export { className as class };
</script>

<Icon src={icon} {alt} {size} {title} class={className} />
