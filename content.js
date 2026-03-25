// 1. 注入 CSS (已將原本的 force-swap 改為 bttv-swap-chat 並整合你提供的樣式)
const style = document.createElement('style');
style.id = 'bttv-replicated-swap';
style.innerHTML = `
.bttv-swap-chat {
  .right-column {
    order: 1;
  }

  .twilight-main {
    order: 2;
  }

  .side-nav,
  div:has(> .side-nav),
  div:has(> seventv-container > .side-nav) {
    order: 3;

    .collapse-toggle {
      transform: rotate(180deg);
    }
  }

  /* Restore channel content and player size */
  .channel-root__right-column.channel-root__right-column--expanded:not(.channel-root__right-column--home) {
    position: relative !important;
    transform: none !important;
  }

  .channel-root__right-column.channel-root__right-column--home {
    display: none !important;
  }

  div:has(> .channel-root) > .persistent-player {
    width: 100%;
  }

  .channel-root__player--with-chat {
    width: 100% !important;
  }

  .channel-info-content {
    width: 100% !important;
  }

  /* Toggle Visibility Arrows */
  .side-nav__toggle-visibility {
    right: unset;
    left: -2.5rem;
    transform: rotate(-180deg);
  }

  .side-nav--collapsed .side-nav__toggle-visibility {
    transform: rotate(180deg);
  }

  .right-column__toggle-visibility {
    left: 1rem;
    transform: rotate(180deg);

    div[role='tooltip'] {
      display: none !important;
    }
  }

  .right-column--collapsed .right-column__toggle-visibility {
    transform: rotate(-180deg);
  }

  /* Theatre Mode */
  .persistent-player--theatre,
  .channel-page__video-player--theatre-mode {
    left: auto !important;
    right: 0;
  }

  .right-column__toggle-visibility {
    z-index: 1000 !important;
  }

  /* order overrides z-index when auto on Firefox, which breaks the settings popout */
  .right-column {
    z-index: 3 !important;

    &.right-column--theatre {
      z-index: 3001 !important;
      right: unset !important;
    }
  }

  /* flips direction on squad streams */
  .multi-stream-player-layout {
    flex-direction: row-reverse;
  }

  /* chat settings */
  .channel-root__right-column div[data-a-target='chat-settings-balloon'] {
    margin-right: -25.3rem !important;
  }
}

`;
document.head.appendChild(style);

// 2. 建立按鈕與邏輯
const injectButtonToHeader = () => {
  const headerRight = document.querySelector('[data-target="channel-header-right"]');
  if (!headerRight || document.getElementById('twitch-swap-native-btn')) return;

  const btnContainer = document.createElement('div');
  btnContainer.className = 'Layout-sc-1xcs6mc-0 gWaIYG';
  btnContainer.id = 'twitch-swap-native-btn';

  const btn = document.createElement('button');
  btn.className = 'ScCoreButton-sc-ocjdkq-0 yezmM';
  btn.innerText = "⮕";
  btn.style.cssText = `
        background-color: #2f2f35;
        color: white;
        margin-right: 8px;
        padding: 0 10px;
        height: 3.2rem;
        font-weight: bold;
        border-radius: 40vm;
        width: 40px;
    `;

  // 讀取快取狀態
  //chrome.storage.local.get(['bttvSwap'], (res) => {
  //    const isActive = res.bttvSwap || false;
  //    toggleClasses(isActive);
  //});

  const toggleClasses = (active) => {
    if (active) {
      document.body.classList.add('bttv-swap-chat');
      btn.innerText = '⬅';
    } else {
      document.body.classList.remove('bttv-swap-chat');
      btn.innerText = '⮕';
    }
  };

  btn.onclick = () => {
    // 這邊實作你要求的切換功能
    const willBeActive = !document.body.classList.contains('bttv-swap-chat');
    toggleClasses(willBeActive);

    // 儲存狀態並觸發 Resize 讓播放器重新計算寬度
    chrome.storage.local.set({ bttvSwap: willBeActive });
    window.dispatchEvent(new Event('resize'));
  };

  btnContainer.appendChild(btn);
  headerRight.insertBefore(btnContainer, headerRight.firstChild);
};

// 3. 監控頁面變動
const observer = new MutationObserver(() => {
  injectButtonToHeader();
});
observer.observe(document.body, { childList: true, subtree: true });

injectButtonToHeader();