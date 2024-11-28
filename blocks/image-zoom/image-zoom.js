import { loadScript } from '../../scripts/aem.js';
import { DM_CONTENT_SERVER_URL, DM_SERVER_URL } from '../../scripts/url-constants.js';

export const embedScene7ZoomViewer = (url, zoomType, block) => {
  const zoomTypeMapping = {
    image_zoom: {
      scriptUrl: 'https://s7d9.scene7.com/s7viewers/html5/js/BasicZoomViewer.js',
      funcNam: 'BasicZoomViewer',
    },
    Flyout: {
      scriptUrl: 'https://s7d9.scene7.com/s7viewers/html5/js/FlyoutViewer.js',
      funcNam: 'FlyoutViewer',
    },
    InlineZoom: {
      scriptUrl: 'https://s7d9.scene7.com/s7viewers/html5/js/FlyoutViewer.js',
      funcNam: 'FlyoutViewer',
    },
    ZoomVertical_dark: {
      scriptUrl: 'https://s7d9.scene7.com/s7viewers/html5/js/ZoomVerticalViewer.js',
      funcNam: 'ZoomVerticalViewer',
    },
    ZoomVertical_light: {
      scriptUrl: 'https://s7d9.scene7.com/s7viewers/html5/js/ZoomVerticalViewer.js',
      funcNam: 'ZoomVerticalViewer',
    },
  };

  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime();
    const uniqueId = `s7viewer-${timestamp}`;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const assetValue = params.get('asset');

    const { scriptUrl, funcNam } = zoomTypeMapping[zoomType] || zoomTypeMapping.image_zoom;
    const viewerDiv = document.createElement('div');
    viewerDiv.id = uniqueId;
    viewerDiv.className = zoomType;
    block.appendChild(viewerDiv);

    loadScript(scriptUrl)
      .then(() => {
        const scene7Script = document.createElement('script');
        scene7Script.textContent = `
          var ${uniqueId}Viewer = new s7viewers.${funcNam}({
            "containerId": "${uniqueId}",
            "params": {
              "serverurl": "${DM_SERVER_URL}",
              "contenturl": "${DM_CONTENT_SERVER_URL}",
              "config": "pricefxstage/${zoomType}",
              "asset": "${assetValue}"
            }
          });
          ${uniqueId}Viewer.init();
        `;
        block.appendChild(scene7Script);
        resolve(viewerDiv);
      })
      .catch(reject);
  });
};

export default function decorate(block) {
  const url = block.querySelector('a')?.getAttribute('href')?.trim();
  const zoomType = block.children[1]?.textContent.trim();

  if (url) {
    embedScene7ZoomViewer(url, zoomType, block).catch((error) => {
      block.innerHTML = `Failed to embed Scene7 viewer: ${error}.`;
    });
  }
}
