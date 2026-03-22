import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import ArchiveFileIcon from '../ArchiveFileIcon.svelte';
import AudioFileIcon from '../AudioFileIcon.svelte';
import CloseIcon from '../CloseIcon.svelte';
import CodeFileIcon from '../CodeFileIcon.svelte';
import CopyIcon from '../CopyIcon.svelte';
import DocumentFileIcon from '../DocumentFileIcon.svelte';
import DownloadIcon from '../DownloadIcon.svelte';
import EditIcon from '../EditIcon.svelte';
import FolderIcon from '../FolderIcon.svelte';
import GenericFileIcon from '../GenericFileIcon.svelte';
import ImageFileIcon from '../ImageFileIcon.svelte';
import PdfFileIcon from '../PdfFileIcon.svelte';
import PresentationFileIcon from '../PresentationFileIcon.svelte';
import SpreadsheetFileIcon from '../SpreadsheetFileIcon.svelte';
import TextFileIcon from '../TextFileIcon.svelte';
import TrashIcon from '../TrashIcon.svelte';
import VideoFileIcon from '../VideoFileIcon.svelte';

describe('icon wrappers', () => {
  const iconCases = [
    { name: 'DownloadIcon', component: DownloadIcon, alt: 'Save', srcPart: 'download' },
    { name: 'CopyIcon', component: CopyIcon, alt: 'Copy', srcPart: 'copy' },
    { name: 'EditIcon', component: EditIcon, alt: 'Edit', srcPart: 'edit' },
    { name: 'TrashIcon', component: TrashIcon, alt: 'Trash', srcPart: 'trash' },
    { name: 'CloseIcon', component: CloseIcon, alt: 'Close', srcPart: 'close_button' },
    { name: 'FolderIcon', component: FolderIcon, alt: 'Folder', srcPart: 'folder' },
    { name: 'GenericFileIcon', component: GenericFileIcon, alt: 'File', srcPart: 'file-generic' },
    { name: 'TextFileIcon', component: TextFileIcon, alt: 'Text file', srcPart: 'file-text' },
    { name: 'PdfFileIcon', component: PdfFileIcon, alt: 'PDF file', srcPart: 'file-pdf' },
    { name: 'ImageFileIcon', component: ImageFileIcon, alt: 'Image file', srcPart: 'file-image' },
    {
      name: 'ArchiveFileIcon',
      component: ArchiveFileIcon,
      alt: 'Archive file',
      srcPart: 'file-archive'
    },
    { name: 'AudioFileIcon', component: AudioFileIcon, alt: 'Audio file', srcPart: 'file-audio' },
    { name: 'VideoFileIcon', component: VideoFileIcon, alt: 'Video file', srcPart: 'file-video' },
    { name: 'CodeFileIcon', component: CodeFileIcon, alt: 'Code file', srcPart: 'file-code' },
    {
      name: 'SpreadsheetFileIcon',
      component: SpreadsheetFileIcon,
      alt: 'Spreadsheet file',
      srcPart: 'file-spreadsheet'
    },
    {
      name: 'DocumentFileIcon',
      component: DocumentFileIcon,
      alt: 'Document file',
      srcPart: 'file-document'
    },
    {
      name: 'PresentationFileIcon',
      component: PresentationFileIcon,
      alt: 'Presentation file',
      srcPart: 'file-presentation'
    }
  ];

  for (const iconCase of iconCases) {
    it(`${iconCase.name} renders expected default alt and asset`, () => {
      render(iconCase.component);

      const image = screen.getByRole('img', { name: iconCase.alt }) as HTMLImageElement;

      expect(image.getAttribute('width')).toBe('16');
      expect(image.getAttribute('height')).toBe('16');
      expect((image.getAttribute('src') || '').includes(iconCase.srcPart)).toBe(true);
    });
  }

  it('forwards custom icon props to the underlying img element', () => {
    render(PdfFileIcon, {
      props: {
        alt: 'Custom PDF icon',
        size: 24,
        title: 'PDF file',
        class: 'custom-icon'
      }
    });

    const image = screen.getByRole('img', { name: 'Custom PDF icon' }) as HTMLImageElement;

    expect(image.getAttribute('width')).toBe('24');
    expect(image.getAttribute('height')).toBe('24');
    expect(image.getAttribute('title')).toBe('PDF file');
    expect(image.classList.contains('sys7-icon')).toBe(true);
    expect(image.classList.contains('custom-icon')).toBe(true);
  });
});
