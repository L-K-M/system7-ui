<script lang="ts">
  type StoryLike = {
    Component?: any;
    props?: Record<string, unknown>;
  };

  export let storyFn: (() => StoryLike) | undefined = undefined;

  let story: StoryLike = {};

  $: story = storyFn ? storyFn() : {};
</script>

<div class="s7-root story-root">
  {#if story.Component}
    <svelte:component this={story.Component} {...story.props ?? {}} />
  {/if}
</div>

<style>
  .story-root {
    min-width: min(92vw, 980px);
    min-height: 180px;
    padding: 20px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #8dc0cc 0%, #6498ad 100%);
  }
</style>
