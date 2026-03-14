<script lang="ts">
  import Icon from './Icon.svelte';
  import icon from '../assets/trash.png';

  export let alt = 'Trash';
  export let size = 16;
  export let title = '';
  let className = '';

  export { className as class };
</script>

<Icon src={icon} {alt} {size} {title} class={className} />
