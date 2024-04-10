import { loadScript } from '../../scripts/aem.js';

const getDefaultEmbed = (url, autoplay) => `<div class="embed-default">
    <iframe src="${url.href}" allowfullscreen="" scrolling="no" allow="${autoplay ? 'autoplay; ' : ''}encrypted-media" 
        title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedBrightcove = (url, autoplay) => {
  const [, account, player] = url.pathname.split('/');
  const video = url.searchParams.get('videoId');
  loadScript(`https://players.brightcove.net/${account}/${player}/index.min.js`, {});
  return `<div>
    <video-js data-account="${account}"
      data-player="${player.split('_')[0]}"
      data-embed="default"
      controls=""
      data-video-id="${video}"
      data-playlist-id=""
      data-application-id=""
      ${autoplay ? 'autoplay=true' : ''}
      ${autoplay ? 'muted=true' : ''}
      class="video-js vjs-fluid"></video-js>
  </div>`;
};

const embedTwitter = (url) => {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js', {});
  return embedHTML;
};

const embedVidyard = (url, autoplay) => {
  const { length, [length - 1]: video } = url.pathname.split('/');
  loadScript('https://play.vidyard.com/embed/v4.js', {});
  return `<div>
      <img class="vidyard-player-embed"
           src="https://play.vidyard.com/${video}.jpg"
           alt=""
           data-uuid="${video}"
           data-v="4"
           data-type="inline"
           data-autoplay="${autoplay ? '1' : '0'}"
           data-muted="${autoplay ? '1' : '0'}"
           loading="lazy"/>
  </div>`;
};

const embedVimeo = (url, autoplay) => {
  const [, video] = url.pathname.split('/');
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  return `<div class="embed-vimeo">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}" frameborder="0" 
      allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
};

const embedWistia = (url, autoplay) => {
  const { length, [length - 1]: video } = url.pathname.split('/');
  loadScript(`//fast.wistia.com/embed/medias/${video}.jsonp`, {});
  loadScript('//fast.wistia.com/assets/external/E-v1.js', {});
  return `<div class="embed-wistia">
    <div class="embed-wistia-responsive-wrapper">
    <div class="wistia_embed wistia_async_${video} ${autoplay ? 'autoPlay=true' : ''} seo=false videoFoam=true">
        &nbsp;</div></div></div>`;
};

const embedYoutube = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  return `<div class="embed-youtube">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" 
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" 
        allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
};

async function loadModal(block) {
  const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
  openModal({ block });
}

const loadEmbed = (block, link, autoplay, isPopup) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['brightcove'],
      embed: embedBrightcove,
    },
    {
      match: ['twitter'],
      embed: embedTwitter,
    },
    {
      match: ['vidyard'],
      embed: embedVidyard,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['wistia'],
      embed: embedWistia,
    },
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);

  // Load Video in Popup
  if (isPopup === 'true') {
    const embedHTML = document.createElement('div');
    if (config) {
      embedHTML.classList = `embed embed-${config.match[0]}`;
      embedHTML.innerHTML = config.embed(url, autoplay);
    } else {
      embedHTML.innerHTML = getDefaultEmbed(url);
      embedHTML.classList = 'embed';
    }
    embedHTML.classList.add('embed-is-loaded');
    loadModal(embedHTML);
    return;
  }

  // Load Video
  if (config) {
    block.innerHTML = config.embed(url, autoplay);
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed';
  }

  block.classList.add('embed-is-loaded');
};

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  const overlayText = block.children[2].textContent.trim();
  const isPopup = block.children[3].textContent.trim();
  block.textContent = '';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    if (overlayText) {
      wrapper.innerHTML = `
      <div class="embed-placeholder-play">
        <button type="button" title="Play"></button>
        <p class="embed-play-title">${overlayText}</p>
      </div>`;
    } else {
      wrapper.innerHTML = '<div class="embed-placeholder-play"><button type="button" title="Play"></button></div>';
    }
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', async () => {
      loadEmbed(block, link, true, isPopup);
    });
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbed(block, link);
      }
    });
    observer.observe(block);
  }
}
