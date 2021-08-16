
window.PROD_MODE = true;

function getBasePath() {
  if ( window.PROD_MODE === true || getModeFromUrl('PROD')) {
    return `https://cloud-save-page-app.herokuapp.com`;
  } else {
    return `http://localhost:3000`;
  }
}

function getModeFromUrl(mode) {
  const querystring = location.search.replace('?', '').split('&');
  for (let i = 0; i < querystring.length; i++) {
      const name = querystring[i].split('=')[0];
      const value = querystring[i].split('=')[1];
      if (name === 'mode' && value === mode) {
        return true;
      }
  }
}

async function saveCurrentUrl() {
  console.log('saveCurrentUrl '+window.location.href);
  const rawResponse = await fetch(`${getBasePath()}/api/pages`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({pageName: window.location.href})
  });
  const content = await rawResponse.json();

  console.log(`saveCurrentUrl `+JSON.stringify(content));
  return content;
}


async function loadCurrentUrlVisitCount(){
  const rawResponse = await fetch(`${getBasePath()}/api/pages/one?pageName=${window.location.href}`);
  const content = await rawResponse.json();

  console.log('loadCurrentUrlVisitCount'+JSON.stringify(content));
  return content;
}

async function loadAllSavedUrlVisitCount(){
  const rawResponse = await fetch(`${getBasePath()}/api/pages`);
  const content = await rawResponse.json();

  console.log('loadAllSavedUrlVisitCount'+JSON.stringify(content));
  return content;
}


async function createButton() {
    const body = document.getElementsByTagName('body')[0];
    const containerElem = document.createElement('div');
    const shadowContainerElem = document.createElement('div');
    containerElem.style.position = 'fixed';
    containerElem.style.background = '#ff4044';
    containerElem.style.color = '#011001';
    containerElem.style.border = '1px';
    containerElem.style.borderRadius = '5px';
    containerElem.style.top = `60px`;
    containerElem.style.left = `0`;
    containerElem.style.zIndex = `999`;
    containerElem.style.width = `100px`;
    containerElem.style.height = `23px`;

    const button = document.createElement("button");
    button.style.background = '#ff4044';
    button.style.borderRadius = '5px';
    button.style.fontSize = '16px';
    button.style.color = `#011001`;

    let pageResp = await loadCurrentUrlVisitCount();
    const count = pageResp.page.length ? pageResp.page[0].count : 0;
    const visitElem = document.createTextNode(`Visit count : ${count}`);
    containerElem.appendChild(visitElem);
    const text = document.createTextNode(`Save Url`);
    let shadow = shadowContainerElem.attachShadow({mode: 'open'});
    button.addEventListener('click', saveCurrentUrl);
    button.appendChild(text);
    containerElem.appendChild(button);
    shadow.appendChild(containerElem); 
    body.appendChild(shadowContainerElem);
}

createButton();