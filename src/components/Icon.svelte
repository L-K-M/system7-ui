<script lang="ts">
  /** Image source URL or imported asset path. */
  export let src: string;

  /** Accessible alternative text for the icon image. */
  export let alt = '';

  /** Rendered icon size in CSS pixels (applies to width and height). */
  export let size = 16;

  /** Optional native image tooltip text. */
  export let title = '';

  /** Additional CSS classes applied to the root `<img>`. */
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
