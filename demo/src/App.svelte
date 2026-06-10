<script lang="ts">
  import '@lkmc/system7-ui/styles.css';
  import {
    ArchiveFileIcon,
    AudioFileIcon,
    BalloonHelp,
    Button,
    Checkbox,
    CodeFileIcon,
    ConfirmDialog,
    CopyIcon,
    DataTable,
    DocumentFileIcon,
    DownloadIcon,
    Dropdown,
    EditIcon,
    ErrorBanner,
    ExpandableSection,
    FolderIcon,
    GenericFileIcon,
    ImageFileIcon,
    ModalDialog,
    MovableDialog,
    Notification,
    PdfFileIcon,
    PresentationFileIcon,
    ProgressBar,
    Radio,
    SpreadsheetFileIcon,
    SystemErrorDialog,
    TextFileIcon,
    TextInput,
    TitleBar,
    TrashIcon,
    VideoFileIcon,
    getSystem7WindowToneVariables
  } from '@lkmc/system7-ui';

  let selectedProfile = $state('quick');
  let autoRefresh = $state(true);
  let includeOffline = $state(false);
  let scanScope = $state('lan');
  let notifications = $state<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>(
    []
  );
  let notificationId = $state(1);
  let installProgress = $state(78);
  let progressIndeterminate = $state(false);
  let hostNameInput = $state('Macintosh IIfx');
  let sharePasswordInput = $state('');

  let showError = $state(false);
  let showModal = $state(false);
  let showMovable = $state(false);
  let showConfirm = $state(false);
  let showSystemError = $state(false);
  let themeSectionExpanded = $state(true);
  let demoWindowHeight = $state<number | null>(null);

  let demoWindowElement: HTMLDivElement | null = null;
  let contentElement: HTMLElement | null = null;

  type WindowColorPreset = {
    key: string;
    label: string;
    color: string;
  };

  const windowColorPresets: WindowColorPreset[] = [
    { key: 'standard', label: 'Standard', color: '#ccccff' },
    { key: 'gold', label: 'Gold', color: '#ffcc99' },
    { key: 'green', label: 'Green', color: '#99cc99' },
    { key: 'turquoise', label: 'Turquoise', color: '#99ffff' },
    { key: 'red', label: 'Red', color: '#ffcccb' },
    { key: 'pink', label: 'Pink', color: '#ffffff' },
    { key: 'blue', label: 'Blue', color: '#99ccff' },
    { key: 'gray', label: 'Gray', color: '#dddddd' }
  ];

  const defaultThemeColors = {
    accent: windowColorPresets[0].color,
    accentText: '#000000',
    highlight: '#000000',
    highlightText: '#ffffff',
    ink: '#000000',
    paper: '#ffffff',
    progressTrack: '#bdc7ff',
    progressFill: '#7a7a7a'
  };

  let accentColor = $state(defaultThemeColors.accent);
  let accentTextColor = $state(defaultThemeColors.accentText);
  let highlightColor = $state(defaultThemeColors.highlight);
  let highlightTextColor = $state(defaultThemeColors.highlightText);
  let inkColor = $state(defaultThemeColors.ink);
  let paperColor = $state(defaultThemeColors.paper);
  let progressTrackColor = $state(defaultThemeColors.progressTrack);
  let progressFillColor = $state(defaultThemeColors.progressFill);

  const profileOptions = [
    { value: 'quick', label: 'Quick' },
    { value: 'standard', label: 'Standard' },
    { value: 'deep', label: 'Deep' }
  ];

  const markdownBalloonMessage = [
    '**Markdown bubble help**',
    '',
    '- Use lists for quick guidance',
    '- Add links like https://example.com',
    '- Highlight `inline code` snippets'
  ].join('\n');

  const scrollRows = Array.from({ length: 24 }, (_, index) => index + 1);
  const scrollColumns = Array.from({ length: 10 }, (_, index) => index + 1);

  type DemoTableSortField = 'host' | 'kind' | 'status' | 'ports';
  type DemoTableSortDirection = 'asc' | 'desc';

  const demoTableColumns = [
    { key: 'host', label: 'Host', width: '30%', sortable: true },
    { key: 'kind', label: 'Kind', width: '28%', sortable: true },
    { key: 'status', label: 'Status', width: '22%', sortable: true },
    { key: 'ports', label: 'Open Ports', width: '20%', sortable: true }
  ];

  const demoTableRows = [
    { host: '192.168.1.3', kind: 'Router', status: 'Online', ports: '80, 443' },
    { host: '192.168.1.22', kind: 'Media server', status: 'Online', ports: '22, 445, 8096' },
    { host: '192.168.1.45', kind: 'Laptop', status: 'Offline', ports: '-' },
    { host: '192.168.1.61', kind: 'Printer', status: 'Online', ports: '80, 631' },
    { host: '192.168.1.93', kind: 'Camera', status: 'Warning', ports: '554, 8554' }
  ];

  let demoTableSortField = $state<DemoTableSortField>('host');
  let demoTableSortDirection = $state<DemoTableSortDirection>('asc');

  function sortDemoTable(field: string) {
    const key = field as DemoTableSortField;
    if (demoTableSortField === key) {
      demoTableSortDirection = demoTableSortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    demoTableSortField = key;
    demoTableSortDirection = 'asc';
  }

  function getSortedDemoRows() {
    const multiplier = demoTableSortDirection === 'asc' ? 1 : -1;
    return [...demoTableRows].sort((left, right) => {
      const l = left[demoTableSortField];
      const r = right[demoTableSortField];
      return l.localeCompare(r, undefined, { numeric: true, sensitivity: 'base' }) * multiplier;
    });
  }

  function addNotification(type: 'success' | 'error' | 'info') {
    const label = type[0].toUpperCase() + type.slice(1);
    const id = notificationId++;
    notifications = [...notifications, { id, message: `${label}: sample message`, type }];
    setTimeout(() => {
      dismissNotification(id);
    }, 4000);
  }

  function dismissNotification(id: number) {
    notifications = notifications.filter((item) => item.id !== id);
  }

  function bumpProgress(delta: number) {
    installProgress = Math.min(100, Math.max(0, installProgress + delta));
  }

  function getDemoWindowMaxHeight() {
    if (window.matchMedia('(max-width: 880px)').matches) {
      return Math.max(360, window.innerHeight - 20);
    }

    return Math.max(420, Math.floor(window.innerHeight * 0.92));
  }

  function resizeDemoWindowToFit() {
    if (!demoWindowElement || !contentElement) {
      return;
    }

    const titleBarHeight =
      demoWindowElement.querySelector<HTMLElement>('.title-bar')?.offsetHeight ?? 35;
    const frameHeight = Math.ceil(titleBarHeight + contentElement.scrollHeight + 2);

    demoWindowHeight = Math.min(getDemoWindowMaxHeight(), Math.max(360, frameHeight));
  }

  type RgbColor = { r: number; g: number; b: number };

  function hexToRgb(value: string): RgbColor {
    const normalized = value.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      return { r: 0, g: 0, b: 0 };
    }

    return {
      r: parseInt(normalized.slice(1, 3), 16),
      g: parseInt(normalized.slice(3, 5), 16),
      b: parseInt(normalized.slice(5, 7), 16)
    };
  }

  function getReadableTextColor(background: string): string {
    const { r, g, b } = hexToRgb(background);
    const luminance = r * 0.299 + g * 0.587 + b * 0.114;
    return luminance > 152 ? '#000000' : '#ffffff';
  }

  function applyWindowColorPreset(preset: WindowColorPreset) {
    accentColor = preset.color;
    accentTextColor = getReadableTextColor(preset.color);
  }

  function getDemoThemeStyle() {
    const windowToneVariables = Object.entries(getSystem7WindowToneVariables(accentColor)).map(
      ([name, value]) => `${name}: ${value}`
    );

    return [
      `--system7-color-accent: ${accentColor}`,
      `--system7-color-accent-text: ${accentTextColor}`,
      `--system7-color-highlight: ${highlightColor}`,
      `--system7-color-highlight-text: ${highlightTextColor}`,
      `--system7-color-ink: ${inkColor}`,
      `--system7-color-paper: ${paperColor}`,
      ...windowToneVariables,
      `--system7-color-progress-track: ${progressTrackColor}`,
      `--system7-color-progress-fill: ${progressFillColor}`
    ].join('; ');
  }

  function resetThemeColors() {
    accentColor = defaultThemeColors.accent;
    accentTextColor = defaultThemeColors.accentText;
    highlightColor = defaultThemeColors.highlight;
    highlightTextColor = defaultThemeColors.highlightText;
    inkColor = defaultThemeColors.ink;
    paperColor = defaultThemeColors.paper;
    progressTrackColor = defaultThemeColors.progressTrack;
    progressFillColor = defaultThemeColors.progressFill;
  }

  function formatColorValue(value: string) {
    return value.toUpperCase();
  }
</script>

<div class="desktop s7-root" style={getDemoThemeStyle()}>
  <Notification {notifications} markdown ondismiss={dismissNotification} />

  <div
    class="s7-window-frame demo-window"
    bind:this={demoWindowElement}
    style={demoWindowHeight ? `height: ${demoWindowHeight}px;` : ''}
  >
    <TitleBar
      title="System 7 UI Components"
      closable
      collapsible
      shadeable
      oncollapse={resizeDemoWindowToFit}
    />

    <main class="content" bind:this={contentElement}>
      <section class="panel">
        <ExpandableSection label="Theme Colors" bind:expanded={themeSectionExpanded}>
          <p class="theme-note">
            Window chrome accents (title bar rails and scrollbar detailing) follow the window color,
            like classic System 7.
          </p>

          <div class="preset-panel">
            <p class="preset-label">Window Color Presets</p>
            <div class="preset-list" role="listbox" aria-label="Window color presets">
              {#each windowColorPresets as preset (preset.key)}
                <button
                  type="button"
                  class="preset-option"
                  class:selected={formatColorValue(accentColor) === formatColorValue(preset.color)}
                  onclick={() => applyWindowColorPreset(preset)}
                >
                  <span
                    class="preset-swatch"
                    style={`background: ${preset.color};`}
                    aria-hidden="true"
                  ></span>
                  <span>{preset.label}</span>
                </button>
              {/each}
            </div>
          </div>

          <div class="theme-grid">
            <label class="color-control" for="accent-color">
              <span>Window Color</span>
              <input id="accent-color" type="color" bind:value={accentColor} />
              <span class="color-value">{formatColorValue(accentColor)}</span>
            </label>

            <label class="color-control" for="accent-text-color">
              <span>Window Text</span>
              <input id="accent-text-color" type="color" bind:value={accentTextColor} />
              <span class="color-value">{formatColorValue(accentTextColor)}</span>
            </label>

            <label class="color-control" for="highlight-color">
              <span>Highlight</span>
              <input id="highlight-color" type="color" bind:value={highlightColor} />
              <span class="color-value">{formatColorValue(highlightColor)}</span>
            </label>

            <label class="color-control" for="highlight-text-color">
              <span>Highlight Text</span>
              <input id="highlight-text-color" type="color" bind:value={highlightTextColor} />
              <span class="color-value">{formatColorValue(highlightTextColor)}</span>
            </label>

            <label class="color-control" for="ink-color">
              <span>Ink</span>
              <input id="ink-color" type="color" bind:value={inkColor} />
              <span class="color-value">{formatColorValue(inkColor)}</span>
            </label>

            <label class="color-control" for="paper-color">
              <span>Paper</span>
              <input id="paper-color" type="color" bind:value={paperColor} />
              <span class="color-value">{formatColorValue(paperColor)}</span>
            </label>

            <label class="color-control" for="progress-track-color">
              <span>Progress Track</span>
              <input id="progress-track-color" type="color" bind:value={progressTrackColor} />
              <span class="color-value">{formatColorValue(progressTrackColor)}</span>
            </label>

            <label class="color-control" for="progress-fill-color">
              <span>Progress Fill</span>
              <input id="progress-fill-color" type="color" bind:value={progressFillColor} />
              <span class="color-value">{formatColorValue(progressFillColor)}</span>
            </label>
          </div>

          <div class="row theme-actions">
            <Button onclick={resetThemeColors}>Reset Theme Colors</Button>
          </div>
        </ExpandableSection>
      </section>

      <section class="panel">
        <h3>Buttons</h3>
        <div class="row">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section class="panel">
        <h3>Icons</h3>
        <div class="row">
          <BalloonHelp message="Save icon">
            <Button variant="icon" title="Save">
              <DownloadIcon />
            </Button>
          </BalloonHelp>
          <BalloonHelp message="Edit icon">
            <Button variant="icon" title="Edit">
              <EditIcon />
            </Button>
          </BalloonHelp>
          <BalloonHelp message="Trash icon">
            <Button variant="icon" title="Trash">
              <TrashIcon />
            </Button>
          </BalloonHelp>
          <BalloonHelp message="Copy icon">
            <Button variant="icon" title="Copy">
              <CopyIcon />
            </Button>
          </BalloonHelp>
        </div>
        <div class="row icon-row">
          <span class="icon-chip"><DownloadIcon />Save</span>
          <span class="icon-chip"><EditIcon />Edit</span>
          <span class="icon-chip"><TrashIcon />Trash</span>
          <span class="icon-chip"><CopyIcon />Copy</span>
        </div>

        <h4 class="icon-subheading">File and Folder Icons</h4>
        <div class="file-icon-grid">
          <span class="icon-chip"><FolderIcon />Folder</span>
          <span class="icon-chip"><GenericFileIcon />Generic File</span>
          <span class="icon-chip"><TextFileIcon />Text File</span>
          <span class="icon-chip"><PdfFileIcon />PDF File</span>
          <span class="icon-chip"><ImageFileIcon />Image File</span>
          <span class="icon-chip"><ArchiveFileIcon />Archive File</span>
          <span class="icon-chip"><AudioFileIcon />Audio File</span>
          <span class="icon-chip"><VideoFileIcon />Video File</span>
          <span class="icon-chip"><CodeFileIcon />Code File</span>
          <span class="icon-chip"><SpreadsheetFileIcon />Spreadsheet</span>
          <span class="icon-chip"><DocumentFileIcon />Document</span>
          <span class="icon-chip"><PresentationFileIcon />Presentation</span>
        </div>
      </section>

      <section class="panel">
        <h3>Balloon Help</h3>
        <div class="row">
          <BalloonHelp message="This is a BalloonHelp tooltip component.">
            <Button>Hover Me</Button>
          </BalloonHelp>
          <BalloonHelp message="You can wrap labels, text, or icons too.">
            <span class="hint-chip">Hover this text</span>
          </BalloonHelp>
          <BalloonHelp markdown message={markdownBalloonMessage}>
            <span class="hint-chip">Hover markdown help</span>
          </BalloonHelp>
        </div>
      </section>

      <section class="panel">
        <h3>Dropdown, Checkbox, Radio</h3>
        <div class="field-row">
          <BalloonHelp
            message="Quick: common ports. Standard: expanded service list. Deep: TCP ports 1-2048."
          >
            <label class="field-label" for="profile">Ports</label>
          </BalloonHelp>
          <Dropdown
            id="profile"
            options={profileOptions}
            value={selectedProfile}
            onchange={(value) => (selectedProfile = value)}
          />
        </div>

        <div class="row">
          <Checkbox checked={autoRefresh} onchange={(next) => (autoRefresh = next)}>
            Auto refresh
          </Checkbox>
          <Checkbox checked={includeOffline} onchange={(next) => (includeOffline = next)}>
            Include offline hosts
          </Checkbox>
        </div>

        <div class="row">
          <Radio
            name="scope"
            value="lan"
            checked={scanScope === 'lan'}
            onchange={() => (scanScope = 'lan')}>LAN only</Radio
          >
          <Radio
            name="scope"
            value="subnet"
            checked={scanScope === 'subnet'}
            onchange={() => (scanScope = 'subnet')}>Current subnet</Radio
          >
        </div>
      </section>

      <section class="panel">
        <h3>TextInput</h3>
        <div class="field-row">
          <label class="field-label" for="host-name">Host name</label>
          <TextInput
            id="host-name"
            bind:value={hostNameInput}
            clearable
            placeholder="Untitled"
            title="Clearable text input"
          />
        </div>
        <div class="field-row">
          <label class="field-label" for="share-password">Password</label>
          <TextInput
            id="share-password"
            type="password"
            bind:value={sharePasswordInput}
            clearable
            placeholder="Required"
          />
        </div>
        <div class="field-row">
          <label class="field-label" for="locked-input">Read only</label>
          <TextInput id="locked-input" value="System Folder" readonly />
        </div>
        <p class="theme-note">The close-box control appears once a clearable field has content.</p>
      </section>

      <section class="panel">
        <h3>ProgressBar</h3>
        <div class="progress-preview">
          <ProgressBar
            value={installProgress}
            indeterminate={progressIndeterminate}
            title={progressIndeterminate ? 'Working…' : `Save progress: ${installProgress}%`}
            ariaLabel="Save progress"
          />
        </div>
        <div class="row progress-controls">
          <Button onclick={() => bumpProgress(-10)} disabled={progressIndeterminate}>-10%</Button>
          <Button onclick={() => bumpProgress(10)} disabled={progressIndeterminate}>+10%</Button>
          <Button onclick={() => (installProgress = 0)} disabled={progressIndeterminate}
            >Reset</Button
          >
          <Button onclick={() => (installProgress = 100)} disabled={progressIndeterminate}
            >Complete</Button
          >
          <span class="progress-value">{progressIndeterminate ? '???' : `${installProgress}%`}</span
          >
          <Checkbox
            checked={progressIndeterminate}
            onchange={(next) => (progressIndeterminate = next)}
          >
            Indeterminate
          </Checkbox>
        </div>
      </section>

      <section class="panel">
        <h3>Scrollbars</h3>
        <div class="scroll-demo" aria-label="Scrollbar preview">
          <div class="scroll-canvas">
            {#each scrollRows as row (row)}
              <div class="scroll-row">
                {#each scrollColumns as column (column)}
                  <span class="scroll-cell">Host {row}.{column}</span>
                {/each}
              </div>
            {/each}
          </div>
        </div>
      </section>

      <section class="panel">
        <h3>DataTable</h3>
        <div class="table-demo" aria-label="Data table demo">
          <DataTable
            columns={demoTableColumns}
            sortKey={demoTableSortField}
            sortDirection={demoTableSortDirection}
            onSort={sortDemoTable}
            empty={demoTableRows.length === 0}
            emptyText="No hosts"
          >
            {#each getSortedDemoRows() as row (row.host)}
              <tr>
                <td>{row.host}</td>
                <td>{row.kind}</td>
                <td>{row.status}</td>
                <td>{row.ports}</td>
              </tr>
            {/each}
          </DataTable>
        </div>
      </section>

      <section class="panel">
        <h3>Dialogs, Banners, Notifications</h3>
        <div class="row">
          <Button onclick={() => (showError = !showError)}
            >{showError ? 'Hide' : 'Show'} Error Banner</Button
          >
          <Button onclick={() => (showModal = true)}>Show ModalDialog</Button>
          <Button onclick={() => (showMovable = true)}>Show MovableDialog</Button>
          <Button onclick={() => (showConfirm = true)}>Show ConfirmDialog</Button>
          <Button onclick={() => (showSystemError = !showSystemError)}>
            {showSystemError ? 'Hide' : 'Show'} SystemErrorDialog
          </Button>
        </div>

        {#if showSystemError}
          <div class="system-error-demo">
            <SystemErrorDialog
              detail="unimplemented trap"
              onrestart={() => {
                showSystemError = false;
                addNotification('success');
              }}
            />
          </div>
        {/if}

        <div class="row">
          <Button onclick={() => addNotification('info')}>Info Notification</Button>
          <Button onclick={() => addNotification('success')}>Success Notification</Button>
          <Button onclick={() => addNotification('error')}>Error Notification</Button>
        </div>

        {#if showError}
          <ErrorBanner
            message="This is a sample error banner. Use it for inline app errors."
            onclose={() => (showError = false)}
          />
        {/if}
      </section>
    </main>
  </div>

  {#if showModal}
    <ModalDialog width="420px" onclose={() => (showModal = false)}>
      <p class="dialog-copy">This is a modal dialog from the shared component package.</p>
      <div class="dialog-actions">
        <Button onclick={() => (showModal = false)}>Close</Button>
      </div>
    </ModalDialog>
  {/if}

  {#if showMovable}
    <MovableDialog title="Movable Dialog" onclose={() => (showMovable = false)}>
      <p class="dialog-copy">Drag me around by the title bar.</p>
      <div class="dialog-actions">
        <Button onclick={() => (showMovable = false)}>Done</Button>
      </div>
    </MovableDialog>
  {/if}

  {#if showConfirm}
    <ConfirmDialog
      message="Apply these settings to all scans?"
      onconfirm={() => {
        showConfirm = false;
        addNotification('success');
      }}
      oncancel={() => (showConfirm = false)}
    />
  {/if}
</div>

<style>
  .desktop {
    min-height: 100%;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .demo-window {
    width: min(980px, 95vw);
    height: min(820px, 92vh);
    background: var(--system7-color-paper, #fff);
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    gap: 14px;
    padding: 14px;
  }

  .panel {
    border: 1px solid var(--system7-color-ink, #000);
    padding: 10px;
  }

  .panel h3 {
    margin: 0 0 10px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }

  .field-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .field-label {
    white-space: nowrap;
  }

  .theme-note {
    margin: 0 0 10px;
    font-size: 16px;
    line-height: 1.1;
  }

  .preset-panel {
    margin-bottom: 10px;
  }

  .preset-label {
    margin: 0 0 6px;
    font-size: 16px;
  }

  .preset-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--system7-color-ink, #000);
    max-width: 360px;
    background: var(--system7-color-paper, #fff);
  }

  .preset-option {
    display: flex;
    align-items: center;
    gap: 10px;
    border: none;
    border-bottom: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    color: var(--system7-color-ink, #000);
    padding: 4px 10px;
    text-align: left;
    cursor: pointer;
    font: inherit;
    line-height: 1;
  }

  .preset-option:last-child {
    border-bottom: none;
  }

  .preset-option:hover,
  .preset-option:focus-visible {
    background: var(--system7-color-highlight, #000);
    color: var(--system7-color-highlight-text, #fff);
    outline: none;
  }

  .preset-option.selected {
    background: var(--system7-color-accent, #000);
    color: var(--system7-color-accent-text, #fff);
  }

  .preset-swatch {
    width: 34px;
    height: 18px;
    border: 1px solid var(--system7-color-ink, #000);
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
    margin-bottom: 10px;
  }

  .color-control {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    padding: 4px 8px;
  }

  .color-control span {
    white-space: nowrap;
  }

  .color-control input[type='color'] {
    width: 34px;
    height: 22px;
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    padding: 0;
    cursor: pointer;
  }

  .color-control input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .color-control input[type='color']::-webkit-color-swatch,
  .color-control input[type='color']::-moz-color-swatch {
    border: none;
  }

  .color-value {
    margin-left: auto;
    font-family: 'Monaco', 'Andale Mono', 'Courier New', monospace;
    font-size: 14px !important;
  }

  .theme-actions {
    margin-bottom: 0;
  }

  .hint-chip {
    border: 1px solid var(--system7-color-ink, #000);
    padding: 4px 8px 2px;
    background: var(--system7-color-paper, #fff);
    cursor: default;
  }

  .icon-row {
    margin-bottom: 0;
  }

  .icon-subheading {
    margin: 2px 0 8px;
    font-size: 16px;
  }

  .file-icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(156px, 1fr));
    gap: 8px;
  }

  .file-icon-grid .icon-chip {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
  }

  .icon-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    padding: 2px 8px 1px;
  }

  .progress-preview {
    width: min(520px, 100%);
    margin-bottom: 10px;
  }

  .progress-controls {
    align-items: center;
    margin-bottom: 0;
  }

  .progress-value {
    min-width: 62px;
    text-align: right;
  }

  .scroll-demo {
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    height: 180px;
    overflow: scroll;
  }

  .scroll-canvas {
    min-width: 1080px;
    padding: 6px;
    box-sizing: border-box;
  }

  .scroll-row {
    display: grid;
    grid-template-columns: repeat(10, minmax(96px, 1fr));
    gap: 6px;
    margin-bottom: 6px;
  }

  .scroll-row:last-child {
    margin-bottom: 0;
  }

  .scroll-cell {
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    padding: 2px 6px 1px;
    white-space: nowrap;
  }

  .table-demo {
    display: flex;
    height: 210px;
    min-height: 0;
    overflow: hidden;
    border: 1px solid var(--system7-color-ink, #000);
  }

  .system-error-demo {
    width: min(420px, 100%);
    margin-top: 10px;
  }

  .dialog-copy {
    margin: 0 0 10px;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 880px) {
    .desktop {
      padding: 10px;
    }

    .demo-window {
      width: 100%;
      height: calc(100vh - 20px);
    }
  }
</style>
