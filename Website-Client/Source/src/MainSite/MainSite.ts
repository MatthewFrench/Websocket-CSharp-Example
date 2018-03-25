import {Interface} from '../Utility/Interface';

/**
 * Handles initializing the entire interface for the main site.
 */
export class MainSite {
    mainInterface: HTMLElement;
    constructor() {
        this.mainInterface = Interface.Create({type: 'div', className: 'MainSite', text: 'test'});
    }

    /**
     * Gets the interface of the documents page.
     * @returns {*}
     */
    getInterface() {
        return this.mainInterface;
    }
}
