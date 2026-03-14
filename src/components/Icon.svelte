<script lang="ts">
  export let src: string;
  export let alt = '';
  export let size = 16;
  export let title = '';
  let className = '';

  export { className as class };
</script>

<img {src} {alt} {title} width={size} height={size} class={`sys7-icon ${className}`.trim()} />

<style>
  .sys7-icon {
    display: block;
    flex-shrink: 0;
    image-rendering: pixelated;
  }
</style>
