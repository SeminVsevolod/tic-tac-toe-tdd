import {expect} from 'chai';
import jsdom from 'jsdom';
import DomController from '../src/DomContoller';

const {JSDOM} = jsdom;
const dom = new JSDOM('<html><body id="root"></body></html>');
const createInstance = () => new DomController('#root');

global.window = dom.window;
global.document = dom.window.document;

describe('DOM controller', () => {
    it('Creates empty table', () => {
        const domController = createInstance();

        domController.createTable();

        expect(document.querySelectorAll('table').length).to.equal(1);
    });
});