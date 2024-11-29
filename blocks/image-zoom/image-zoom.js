import { loadScript } from '../../scripts/aem.js';
import { DM_CONTENT_SERVER_URL, DM_SERVER_URL } from '../../scripts/url-constants.js';

export default function decorate(block) {
  const url = block.querySelector('a')?.getAttribute('href')?.trim();
  const zoomType = block.children[1]?.textContent.trim();
  const timestamp = new Date().getTime();

  const zoomTypeMapping = {
    image_zoom: {
      scriptUrl: 'https://s7d9.scene7.com/s7viewers/html5/js/BasicZoomViewer.js',
      funcNam: 'BasicZoomViewer',
    },
    InlineZoom: {
      scriptUrl: 'https://s7d9.scene7.com/s7viewers/html5/js/FlyoutViewer.js',
      funcNam: 'FlyoutViewer',
    },
    ZoomVertical_dark: {
      scriptUrl: 'https://s7d9.scene7.com/s7viewers/html5/js/ZoomVerticalViewer.js',
      funcNam: 'ZoomVerticalViewer',
    },
  };

  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const assetValue = params.get('asset');
  let scriptUrl = '';
  let funcNam = '';
  ({ scriptUrl, funcNam } = zoomTypeMapping[zoomType] || zoomTypeMapping.image_zoom);
  block.innerHTML = `<div id="image-viewer-${timestamp}" class=${zoomType}></div>`;

  loadScript(scriptUrl)
    .then(() => {
      const scene7Script = document.createElement('script');
      scene7Script.textContent = `var s7basiczoomviewer = new s7viewers.${funcNam}({
		  "containerId" : "image-viewer-${timestamp}",
		  "params" : { 
        "serverurl" : "${DM_SERVER_URL}",
        "contenturl" : "${DM_CONTENT_SERVER_URL}", 
        "config" : "pricefxstage/${zoomType}",
        "asset" : "${assetValue}" }
        })
      s7basiczoomviewer.init();`;
      block.appendChild(scene7Script);
    })
    .catch((error) => {
      block.innerHTML = `Error loading ${zoomType} Viewer script: ${error}`;
    });
}
