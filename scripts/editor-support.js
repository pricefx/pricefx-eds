import {
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  loadBlock,
  loadBlocks,
} from './aem.js';
// eslint-disable-next-line import/no-unresolved
import { decorateRichtext } from './editor-support-rte.js';
import { decorateMain } from './scripts.js';

async function applyChanges(event) {
  // redecorate default content and blocks on patches (in the properties rail)
  const { detail } = event;

  const resource =
    detail?.request?.target?.resource || // update, patch components
    detail?.request?.target?.container?.resource || // update, patch, add to sections
    detail?.request?.to?.container?.resource; // move in sections

  if (!resource) {
    return false;
  }

  const updates = detail?.response?.updates;
  if (!updates.length) {
    return false;
  }

  const { content } = updates[0];
  if (!content) {
    return false;
  }

  const parsedUpdate = new DOMParser().parseFromString(content, 'text/html');
  const element = document.querySelector(`[data-aue-resource="${resource}"]`);

  if (element) {
    if (element.matches('main')) {
      const newMain = parsedUpdate.querySelector(`[data-aue-resource="${resource}"]`);
      newMain.style.display = 'none';
      element.insertAdjacentElement('afterend', newMain);
      decorateMain(newMain);
      decorateRichtext(newMain);
      await loadBlocks(newMain);
      element.remove();
      newMain.style.display = null;
      // eslint-disable-next-line no-use-before-define
      attachEventListners(newMain);
      return true;
    }

    const block =
      element.parentElement?.closest('.block[data-aue-resource]') || element?.closest('.block[data-aue-resource]');
    if (block) {
      const blockResource = block.getAttribute('data-aue-resource');
      const newBlock = parsedUpdate.querySelector(`[data-aue-resource="${blockResource}"]`);
      if (newBlock) {
        newBlock.style.display = 'none';
        block.insertAdjacentElement('afterend', newBlock);
        decorateButtons(newBlock);
        decorateIcons(newBlock);
        decorateRichtext(newBlock);
        decorateBlock(newBlock);
        await loadBlock(newBlock);
        block.remove();
        newBlock.style.display = null;

        return true;
      }
    } else {
      // sections and default content, may be multiple in the case of richtext
      const newElements = parsedUpdate.querySelectorAll(
        `[data-aue-resource="${resource}"],[data-richtext-resource="${resource}"]`,
      );
      if (newElements.length) {
        const { parentElement } = element;
        if (element.matches('.section')) {
          const [newSection] = newElements;
          newSection.style.display = 'none';
          element.insertAdjacentElement('afterend', newSection);
          decorateButtons(newSection);
          decorateIcons(newSection);
          decorateRichtext(newSection);
          decorateSections(parentElement);
          decorateBlocks(parentElement);
          await loadBlocks(parentElement);
          element.remove();
          newSection.style.display = null;

        } else {
          element.replaceWith(...newElements);
          decorateButtons(parentElement);
          decorateIcons(parentElement);
          decorateRichtext(parentElement);

        }
        return true;
      }
    }
  }

  return false;
}


function postReadTime(readingTime) {
  const postData = {
    connections: [
      {
        name: "aemconnection",
        protocol: "xwalk",
        uri: "https://author-p131512-e1282665.adobeaemcloud.com"
      }
    ],
    target: {
      resource: "urn:aemconnection:/content/pricefx/en/learning-center/10-cool-things-your-business-can-do-with-dynamic-pricing/jcr:content",
      type: "component",
      prop: ""
    },
    patch: [
      {
        op: "replace",
        path: "/readingtime",
        value: readingTime.toString()
      }
    ]
  };

  fetch("https://universal-editor-service.experiencecloud.live/patch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  })
    .then(response => response.json())
    .then(data => {
       // eslint-disable-next-line no-console
      console.log("Success:", data);
    })
    .catch((error) => {
       // eslint-disable-next-line no-console
      console.error("Error:", error);
    });
}


function attachEventListners(main) {
  ['aue:content-patch', 'aue:content-update', 'aue:content-add', 'aue:content-move', 'aue:content-remove'].forEach(
    (eventType) =>
      main?.addEventListener(eventType, async (event) => {
        event.stopPropagation();
        const applied = await applyChanges(event);

        // Calculate read time for the main content
        const articleText = main.innerText;
        const wordsArray = articleText.split(' ');
        const wordCount = wordsArray.length;
        const wordsPerMinute = 200;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
      
        // eslint-disable-next-line no-console
        console.log(
          `This article has ${wordCount} words and will take approximately ${readingTime} minute(s) to read.`
        );
        
        postReadTime(readingTime)

        if (!applied) {
          window.location.reload();
        }
      }),
  );
}

attachEventListners(document.querySelector('main'));
