const loadScript = (url, attrs) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (attrs) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const attr in attrs) {
      script.setAttribute(attr, attrs[attr]);
    }
  }
  head.append(script);
  return script;
};

const embedMarketoForm = (marketoId, formId, successUrl) => {
  if (marketoId && formId) {
    const mktoScriptTag = loadScript('//lp.pricefx.com/js/forms2/js/forms2.min.js');
    mktoScriptTag.onload = () => {
      if (successUrl) {
        window.MktoForms2.loadForm('//lp.pricefx.com', marketoId, formId, (form) => {
          // Add an onSuccess handler
          // eslint-disable-next-line no-unused-vars
          form.onSuccess((values, followUpUrl) => {
            // Take the lead to a different page on successful submit,
            // ignoring the form's configured followUpUrl
            window.location.href = successUrl;

            // Return false to prevent the submission handler continuing with its own processing
            return false;
          });
        });
      } else {
        window.MktoForms2.loadForm('//lp.pricefx.com', marketoId, formId);
      }
    };
  }
};

export default function decorate(block) {
  const [formTitle, formDescription, marketoFormId, marketoSuccessUrl] = block.children;
  block.innerHTML = '';

  const title = formTitle.textContent.trim();
  const description = formDescription.textContent.trim();
  const formId = marketoFormId.textContent.trim();
  const successUrl = marketoSuccessUrl.querySelector('a').href;
  const marketoId = '289-DOX-852';

  if (formId && marketoId) {
    // Create the form element
    const formElement = document.createElement('form');
    formElement.id = `mktoForm_${formId}`;

    // Create and append form title (if available)
    if (title !== '') {
      const titleElement = document.createElement('h2');
      titleElement.classList.add('form-title');
      titleElement.textContent = title;
      block.append(titleElement);
    }

    // Create and append form description (if available)
    if (description !== '') {
      const descriptionElement = formDescription.firstElementChild;
      descriptionElement.classList.add('form-description');
      block.append(descriptionElement);
    }

    // Append the form element
    block.append(formElement);

    // Set up an observer to embed the Marketo form when block is in view
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        // Embed the Marketo form
        embedMarketoForm(marketoId, formId, successUrl);
        observer.disconnect();
      }
    });

    // Start observing the block
    observer.observe(block);
  }
}
