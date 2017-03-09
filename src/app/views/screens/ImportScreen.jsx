import React from 'react';
import isempty from 'lodash.isempty';
import { ObjectUtils, StepsIterator } from 'flux-core-lib';
// project
import Constants from './../../constants';
import ScreenFooter from './../commons/ScreenFooter';
import ReactAceEditor from './../commons/ReactAceEditor';

class ImportScreen extends React.PureComponent {

  constructor (props) {
    super(props);
    this._ismounted = false;
    this._stepsIterator = StepsIterator([
      () => this.renderFileImportStep.bind(this),
      // question: is it a description file
      () => this.renderSelectLanguage.bind(this),
      // question: import another language
      () => this.renderLoadMoreContent.bind(this)
    ]);

    let defaultvalue = '// Put your JSON code to start working with your translations';
    if (!isempty(props.primarykeys)) {
      defaultvalue = props.primarykeys
        .reduce((obj, key) => Object.assign(obj, { [key]: '' }), {});
      defaultvalue = JSON.stringify(defaultvalue, null, '  ');
    }

    this.state = {
      defaultvalue,
      count: 0,
      langkey: false,
      editormode: 'json',
      jsonisvalid: false,
      jsonstring: defaultvalue,
      currentstep: this._stepsIterator.next().value
    };
  }

  /* --------------------------------------------------

   Lifecycle

  -------------------------------------------------- */

  componentDidMount () {
    this._ismounted = true;
  }

  componentWillUnmount () {
    this._ismounted = false;
  }

  /* --------------------------------------------------

   Privates

  -------------------------------------------------- */

  _onLoadYesNoClickHandler (e, response) {
    e.preventDefault();
    const action = this.context.facade.getAction('ApplicationAction');
    action.addLanguage(this.state.langkey, this.state.jsonstring);
    if (response) {
      this.setState({
        langkey: false,
        jsonisvalid: false,
        count: (this.state.count + 1),
        currentstep: this._stepsIterator.next().value,
        jsonstring: response
          ? this.state.defaultvalue
          : false
      });
    } else {
      action.toggleScreen(Constants.SCREENS.EDIT);
    }
  }

  _onClickSubmitHandler (e) {
    e.preventDefault();
    this.setState({
      jsonisvalid: false,
      currentstep: this._stepsIterator.next().value
    });
  }

  _onClickLanguageHandler (e, langkey) {
    e.stopPropagation();
    this.setState({
      langkey
    });
  }

  _onAceEditorChange (value) {
    let jsonisvalid = false;
    const jsonstring = value;
    if (!isempty(value)) {
      try {
        JSON.parse(jsonstring);
        jsonisvalid = true;
      } catch (e) {
        // if value is empty, is not a valid string
      }
    }
    this.setState({
      jsonstring,
      jsonisvalid
    });
  }

  /* --------------------------------------------------

   Steps Renders

  -------------------------------------------------- */

  renderLoadMoreContent () {
    return (
      <div className="flex-rows flex-centered"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}>
        <h3>
          <span>Load more language set ?</span>
        </h3>
        <p style={{
          marginTop: '0'
        }}>
          <button onClick={e => this._onLoadYesNoClickHandler(e, false)}
            style={{
              margin: '0 10px',
              paddingLeft: '20px',
              paddingRight: '20px',
              background: this.context.theme.grey
            }}>
            <span>No</span>
          </button>
          <button onClick={e => this._onLoadYesNoClickHandler(e, true)}
            style={{
              margin: '0 10px',
              paddingLeft: '20px',
              paddingRight: '20px',
              background: this.context.theme.velvet
            }}>
            <span>Yes</span>
          </button>
        </p>
      </div>
    );
  }

  renderSelectLanguage () {
    const languages = {
      // using language keys RFC 3066
      'en-US': 'English',
      'it-IT': 'Italian',
      'fr-FR': 'French',
      'es-ES': 'Spanish',
      'pt-PT': 'Portuguese',
      'de-DE': 'German'
    };
    return (
      <div className="flex-rows flex-centered"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}>
        <h3>
          <span>Select language ?</span>
        </h3>
        <p style={{
          marginTop: '0'
        }}>
          {ObjectUtils.entries(languages)
            .filter(([key]) => (this.props.langs.indexOf(key) === -1))
            .map(([key, val]) =>
              <label key={`radio-${key}`}
                htmlFor={key}
                style={{
                  marginRight: '7px'
                }}>
                <input id={key}
                  value={key}
                  type="radio"
                  name="lang-radio-input"
                  onClick={e => this._onClickLanguageHandler(e, key)} />
                <span style={{
                  marginLeft: '3px'
                }}>{val}</span>
              </label>
            )}
        </p>
      </div>
    );
  }

  renderFileImportStep () {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
        <ReactAceEditor usecopy={false}
          readOnly={false}
          editorid={'editor-import'}
          editormode={this.state.editormode}
          jsonstring={this.state.jsonstring}
          defaultvalue={this.props.defaultvalue}
          changehandler={e => this._onAceEditorChange(e)} />
      </div>
    );
  }

  /* --------------------------------------------------

   Renders

  -------------------------------------------------- */

  render () {
    const showsubmit = this.state.jsonisvalid || this.state.langkey;
    return (
      <div className="application-screen-content flex-rows"
        style={{
          padding: '0',
          width: '100%',
          height: '100%',
          margin: '0 auto',
          overflow: 'hidden',
          background: 'white'
        }}>
        <div className="flex-rows"
          style={{
            width: '100%',
            height: '100%'
          }}>{this.state.currentstep()}</div>
        <ScreenFooter cancelClickHandler={false}
          submitClickHandler={!showsubmit
            ? false : e => this._onClickSubmitHandler(e)} />
      </div>
    );
  }

}

ImportScreen.contextTypes = {
  theme: React.PropTypes.object,
  facade: React.PropTypes.object
};

ImportScreen.propTypes = {
  defaultvalue: React.PropTypes.string,
  langs: React.PropTypes.array.isRequired,
  primarykeys: React.PropTypes.array.isRequired
};

ImportScreen.defaultProps = {
  defaultvalue: '// Put your JSON code to start working with your translations'
};

export default ImportScreen;
