<script lang="ts">
  import bombIcon from '../assets/bomb-icon.png';
  import Button from './Button.svelte';
  import ModalDialog from './ModalDialog.svelte';

  /** Main confirmation prompt shown in the dialog body. */
  export let message = '';

  /** Label for the primary confirmation button. */
  export let okText = 'OK';

  /** Label for the secondary cancel button. */
  export let cancelText = 'Cancel';

  /** Callback fired when the confirm button is clicked. */
  export let onconfirm: (() => void) | undefined = undefined;

  /** Callback fired when the cancel button/backdrop is clicked. */
  export let oncancel: (() => void) | undefined = undefined;

  function handleOk() {
    if (onconfirm) {
      onconfirm();
    }
  }

  function handleCancel() {
    if (oncancel) {
      oncancel();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    // Enter activates the outlined default button, System 7 style — unless
    // focus is on a button, which keeps its own native Enter activation.
    if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      handleOk();
    }
  }
</script>

<svelte:window on:keydown|capture={handleKeydown} />

<ModalDialog width="400px" onclose={handleCancel}>
  <div class="confirm-content">
    <img src={bombIcon} alt="" class="bomb-icon" />
    <p class="message dialog-text">{message}</p>
  </div>
  <div class="button-row">
    <Button onclick={handleCancel}>{cancelText}</Button>
    <Button variant="primary" onclick={handleOk}>{okText}</Button>
  </div>
</ModalDialog>

<style>
  .confirm-content {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    align-items: flex-start;
  }

  .bomb-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    margin-top: -7px;
  }

  .message {
    flex: 1;
    min-height: 32px;
    margin: 0;
    line-height: 1.3;
  }

  .button-row {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin: -10px;
    margin-right: -14px;
  }
</style>
