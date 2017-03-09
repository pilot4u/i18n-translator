import isempty from 'lodash.isempty';
import isstring from 'lodash.isstring';
import { diff, apply } from 'rus-diff';
import { ArrayUtils, AbstractStore, ObjectUtils } from 'flux-core-lib';
// project
import Constants from './../constants';

class ApplicationStore extends AbstractStore {

  constructor (dispatcher) {
    super({
      json: {},
      langs: [],
      values: [],
      origin: {},
      collapsed: [],
      primarykeys: [],
      openscreen: false,
      selectexport: 0
    }, dispatcher);
  }

  _onToggleColumnChange (key) {
    let collapsed = this.getState('collapsed');
    if (collapsed.indexOf(key) !== -1) {
      collapsed = collapsed.filter(item => (item !== key));
    } else {
      collapsed.push(key);
    }
    this.setState({
      collapsed
    });
  }

  /**
   * @description Get all existing primary keys, filter the params one
   * by checking if already exists in current collection
   * then concat with existing and ordering doing an alphanumeric sort
   *
   * @param {String} langkey
   * @param {String} jsonstring
   */
  _onAddLanguageChange ([langkey, jsonstring]) {
    let values = JSON.parse(jsonstring);
    const origin = this.getState('origin');
    const langs = this.getState('langs').concat([langkey]);

    // preserve originals values
    origin[langkey] = ObjectUtils.clone(values);

    let primarykeys = this.getState('primarykeys');
    primarykeys = Object.keys(values)
      // check if primary keys exists
      .filter(key => (primarykeys.indexOf(key) === -1))
      // add to current primary keys
      .concat(primarykeys)
      // sort by alpha order
      .sort(ArrayUtils.alphasort);

    values = this.getState('values')
      .concat([values])
      .map(obj => ObjectUtils.fillwith(obj, primarykeys));

    this.setState({
      langs,
      origin,
      values,
      primarykeys
    });
  }

  _onUpdateValueChange ({ primarykey, lang, value }) {
    const index = this.getState('langs').indexOf(lang);
    const values = this.getState('values');
    values[index][primarykey] = value;
    this.setState({
      values
    });
  }

  _onExportDiffChange () {
    const langs = this.getState('langs');
    const values = this.getState('values');

    const current = langs.reduce((acc, lang) =>
      Object.assign(acc, { [lang]: values[langs.indexOf(lang)] }), {});
    this.setState({
      json: apply({}, diff(this.getState('origin'), current))
    });
  }

  _onSelectedExportChange (index) {
    this.setState({
      selectexport: index
    });
  }

  /**
   * @param {String} nextscreen
   */
  _onScreenChange (nextscreen) {
    const langs = this.getState('langs');
    const screen = this.getState('openscreen');
    const openscreen = langs.length
      ? Constants.SCREENS.EDIT
      : Constants.SCREENS.CONNECT;

    // eslint-disable-next-line
    console.log('DEBUG :: current > next screen', `${screen} > ${nextscreen}`);

    this.setState({
      openscreen: isstring(nextscreen) && !isempty(nextscreen)
        ? nextscreen
        : openscreen
    });
  }

  /**
   *
   */
  _initDispatcher () {
    const token = this._dispatcher.register((obj) => {
      switch (obj.type) {
      case Constants.FLUX.SELECT_EXPORT:
        this._onSelectedExportChange(obj.data);
        break;
      case Constants.FLUX.UPDATE_VALUE:
        this._onUpdateValueChange(obj.data);
        break;
      case Constants.FLUX.EXPORT_DIFF_CHANGES:
        this._onExportDiffChange();
        break;
      case Constants.FLUX.ADD_LANGUAGE:
        this._onAddLanguageChange(obj.data);
        break;
      case Constants.FLUX.TOGGLE_SCREEN:
        this._onScreenChange(obj.data);
        break;
      case Constants.FLUX.TOGGLE_COLUMN:
        this._onToggleColumnChange(obj.data);
        break;
      default:
        break;
      }
    });
    ApplicationStore.DISPATCH_TOKEN = token;
  }

}

export default ApplicationStore;
