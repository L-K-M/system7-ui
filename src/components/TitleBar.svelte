<script lang="ts">
  import titleBg from '../assets/titlebar_bg.png';
  import closeButton from '../assets/close_button.png';
  import resizeButton from '../assets/resize_button.png';
  import windowshadeButton from '../assets/windowshade_button.png';

  export let title: string;
  export let closable = false;
  export let collapsible = false;
  export let shadeable = false;
  export let draggable = false;
  export let focused = true;

  export let onclose: (() => void) | undefined = undefined;
  export let oncollapse: (() => void) | undefined = undefined;
  export let onshade: (() => void) | undefined = undefined;
  export let ondragstart: ((e: MouseEvent) => void) | undefined = undefined;

  function handleMousedown(event: MouseEvent) {
    if (!draggable) {
      return;
    }

    const target = event.target as HTMLElement;
    if (
      target.closest('.close-box') ||
      target.closest('.collapse-box') ||
      target.closest('.shade-box') ||
      target.closest('.button-container')
    ) {
      return;
    }

    if (ondragstart) {
      ondragstart(event);
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="title-bar"
  class:draggable
  class:unfocused={!focused}
  onmousedown={handleMousedown}
  style="background-image: url({titleBg});"
>
  {#if closable}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="button-container" onmousedown={(e) => e.stopPropagation()}>
      <div
        class="close-box"
        role="button"
        tabindex="0"
        onclick={onclose}
        style="background-image: url({closeButton});"
      ></div>
    </div>
  {/if}

  <div class="title-text">{title}</div>

  <div class="right-side-buttons">
    {#if collapsible}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="button-container" onmousedown={(e) => e.stopPropagation()}>
        <div
          class="collapse-box"
          role="button"
          tabindex="0"
          onclick={oncollapse}
          style="background-image: url({resizeButton});"
        ></div>
      </div>
    {/if}

    {#if shadeable}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="button-container" onmousedown={(e) => e.stopPropagation()}>
        <div
          class="shade-box"
          role="button"
          tabindex="0"
          onclick={onshade}
          style="background-image: url({windowshadeButton});"
        ></div>
      </div>
    {/if}
  </div>
</div>

<style>
  .title-bar {
    border-bottom: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    position: relative;
    user-select: none;
    cursor: default;
    height: 35px;
    box-sizing: border-box;
    background-color: #eee;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    border-right: 2px solid #a3a3d7;
    border-left: 2px solid #ccccff;
    image-rendering: pixelated;
  }

  .title-text {
    font-family: 'Sysfont', 'Chicago', 'Impact', sans-serif !important;
    letter-spacing: 1px;
    background: #eee;
    font-size: 24px;
    padding: 4px 12px 2px 12px;
    font-weight: normal;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    white-space: nowrap;
  }

  .right-side-buttons {
    display: flex;
  }

  .button-container {
    width: 22px;
    height: 22px;
    padding: 2px;
    background-color: #f4f4f4;
    z-index: 10;
  }

  .button-container:has(.close-box) {
    margin-left: 12px;
  }

  .button-container:has(.collapse-box) {
    margin-right: 12px;
  }

  .button-container:has(.shade-box) {
    margin-right: 12px;
  }

  .close-box,
  .collapse-box,
  .shade-box {
    width: 22px;
    height: 22px;
    background: #fff;
    background-size: contain;
    position: relative;
    cursor: pointer;
    pointer-events: auto;
  }

  .shade-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;
    padding: 5px 4px;
    box-sizing: border-box;
  }

  .close-box:active,
  .collapse-box:active,
  .shade-box:active {
    filter: invert(1);
  }

  .title-bar.unfocused {
    background-image: none !important;
    background-color: #fff;
    border-right-color: #fff;
    border-left-color: #fff;
  }

  .title-bar.unfocused .title-text {
    background: #fff;
    color: #888;
  }

  .title-bar.unfocused .button-container {
    display: none;
  }
</style>
