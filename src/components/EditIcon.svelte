<script lang="ts">
  import icon from '../assets/edit.png';

  export let alt = 'Edit';
  export let size = 16;
  export let title = '';
  let className = '';

  export { className as class };
</script>

<img src={icon} {alt} {title} width={size} height={size} class={`sys7-icon ${className}`.trim()} />

<style>
  .sys7-icon {
    display: block;
    flex-shrink: 0;
    image-rendering: pixelated;
  }
</style>
