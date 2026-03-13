<script>
  import '@lkmc/system7-ui/styles.css';
  import {
    BalloonHelp,
    Button,
    Checkbox,
    ConfirmDialog,
    CopyIcon,
    DownloadIcon,
    Dropdown,
    EditIcon,
    ErrorBanner,
    ModalDialog,
    MovableDialog,
    Notification,
    Radio,
    TitleBar,
    TrashIcon
  } from '@lkmc/system7-ui';

  let selectedProfile = 'quick';
  let autoRefresh = true;
  let includeOffline = false;
  let scanScope = 'lan';
  let notifications = [];
  let notificationId = 1;

  let showError = false;
  let showModal = false;
  let showMovable = false;
  let showConfirm = false;

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

  function addNotification(type) {
    const label = type[0].toUpperCase() + type.slice(1);
    const id = notificationId++;
    notifications = [...notifications, { id, message: `${label}: sample message`, type }];
    setTimeout(() => {
      notifications = notifications.filter((item) => item.id !== id);
    }, 2500);
  }
</script>

<div class="desktop">
  <Notification {notifications} />

  <div class="window-frame demo-window">
    <TitleBar title="System 7 UI Components" closable collapsible shadeable />

    <main class="content">
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
            onchange={() => (scanScope = 'lan')}
            >LAN only</Radio
          >
          <Radio
            name="scope"
            value="subnet"
            checked={scanScope === 'subnet'}
            onchange={() => (scanScope = 'subnet')}
            >Current subnet</Radio
          >
        </div>
      </section>

      <section class="panel">
        <h3>Dialogs, Banners, Notifications</h3>
        <div class="row">
          <Button onclick={() => (showError = !showError)}>{showError ? 'Hide' : 'Show'} Error Banner</Button>
          <Button onclick={() => (showModal = true)}>Show ModalDialog</Button>
          <Button onclick={() => (showMovable = true)}>Show MovableDialog</Button>
          <Button onclick={() => (showConfirm = true)}>Show ConfirmDialog</Button>
        </div>

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
    min-height: 680px;
    background: #fff;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 14px;
  }

  .panel {
    border: 1px solid #000;
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

  .hint-chip {
    border: 1px solid #000;
    padding: 4px 8px 2px;
    background: #fff;
    cursor: default;
  }

  .icon-row {
    margin-bottom: 0;
  }

  .icon-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #000;
    background: #fff;
    padding: 2px 8px 1px;
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
      min-height: auto;
    }
  }
</style>
