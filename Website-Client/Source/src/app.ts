//Load the CSS
//import style from './app.scss';
require('./app.scss');

// classes you want to use immediately
import {MainSite} from './MainSite/MainSite';

/**
 * Initializes the documents page.
 */
function main() {
  let site = new MainSite();
  document.body.appendChild(site.getInterface());
}

//Initializes everything when the page is finished loading.
document.addEventListener('DOMContentLoaded', main);
