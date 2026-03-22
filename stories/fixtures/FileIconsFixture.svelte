<script lang="ts">
  import ArchiveFileIcon from '../../src/components/ArchiveFileIcon.svelte';
  import AudioFileIcon from '../../src/components/AudioFileIcon.svelte';
  import CodeFileIcon from '../../src/components/CodeFileIcon.svelte';
  import DocumentFileIcon from '../../src/components/DocumentFileIcon.svelte';
  import FolderIcon from '../../src/components/FolderIcon.svelte';
  import GenericFileIcon from '../../src/components/GenericFileIcon.svelte';
  import ImageFileIcon from '../../src/components/ImageFileIcon.svelte';
  import PdfFileIcon from '../../src/components/PdfFileIcon.svelte';
  import PresentationFileIcon from '../../src/components/PresentationFileIcon.svelte';
  import SpreadsheetFileIcon from '../../src/components/SpreadsheetFileIcon.svelte';
  import TextFileIcon from '../../src/components/TextFileIcon.svelte';
  import VideoFileIcon from '../../src/components/VideoFileIcon.svelte';

  export let size = 16;

  const icons = [
    { label: 'Folder', component: FolderIcon },
    { label: 'File', component: GenericFileIcon },
    { label: 'Text', component: TextFileIcon },
    { label: 'PDF', component: PdfFileIcon },
    { label: 'Image', component: ImageFileIcon },
    { label: 'Archive', component: ArchiveFileIcon },
    { label: 'Audio', component: AudioFileIcon },
    { label: 'Video', component: VideoFileIcon },
    { label: 'Code', component: CodeFileIcon },
    { label: 'Sheet', component: SpreadsheetFileIcon },
    { label: 'Document', component: DocumentFileIcon },
    { label: 'Presentation', component: PresentationFileIcon }
  ];
</script>

<div class="icon-grid">
  {#each icons as item (item.label)}
    <div class="icon-cell">
      <svelte:component this={item.component} {size} alt={item.label} />
      <span>{item.label}</span>
    </div>
  {/each}
</div>

<style>
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(90px, 1fr));
    gap: 10px;
  }

  .icon-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
  }

  .icon-cell span {
    font-size: 14px;
    line-height: 1;
  }
</style>
