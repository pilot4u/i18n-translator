import React from 'react';
import isempty from 'lodash.isempty';
import isstring from 'lodash.isstring';
// punkbeer
import logo from './../../assets/json_logo.svg';

class ApplicationMainMenu extends React.PureComponent {

  constructor (props) {
    super(props);
    this.state = {};
  }

  /* --------------------------------------------------------

   Privates

  -------------------------------------------------------- */

  _searchFor (evt) {
    evt.preventDefault();
  }

  _createNewLanguage (evt) {
    evt.preventDefault();
    const key = this._newlangInput.value;
    if (!isstring(key) || isempty(key.trim()) || (this.props.langs.indexOf(key) >= 0)) {
      return false;
    }
    const ApplicationAction = this.props.facade.getAction('ApplicationAction');
    ApplicationAction.createNewLanguage(key);
    return true;
  }

  /* --------------------------------------------------------

   Renders Sub Components

  -------------------------------------------------------- */

  _renderSearchInput () {
    return (
      <span>
        <input type="text"
          style={{
            width: '240px',
            marginRight: '3px'
          }}
          placeholder="Search for..." />
        <button onClick={e => this._searchFor(e)} >
          <span>
            <i className="icon-search" />
          </span>
        </button>
      </span>
    );
  }

  _renderCreateNewLanguage () {
    return (
      <span>
        <input type="text"
          style={{
            width: '240px',
            marginRight: '3px'
          }}
          ref={(c) => { this._newlangInput = c; }}
          placeholder="Create new language" />
        <button onClick={e => this._createNewLanguage(e)} >
          <span>Create</span>
        </button>
      </span>
    );
  }

  render () {
    return (
      <div className="application-header shadow-bottom"
        style={{
          width: '100%',
          background: '#FBFBFB'
        }}>
        <h1 style={{
          margin: '10px 0',
          textAlign: 'center'
        }}>
          <img alt="JSON Translation Online Editor"
            style={{
              width: '40px',
              height: '40px',
              marginRight: '10px',
              verticalAlign: 'bottom'
            }}
            src={logo} />
          <span>JSON Translation Online Editor</span>
        </h1>
        <div className="application-main-menu flex-columns flex-space-between"
          style={{
            width: '100%',
            background: '#FBFBFB'
          }}>
          {/* this._renderSearchInput() */}
          {this._renderCreateNewLanguage()}
        </div>
      </div>
    );
  }

}

ApplicationMainMenu.propTypes = {
  langs: React.PropTypes.array.isRequired,
  facade: React.PropTypes.object.isRequired
};

export default ApplicationMainMenu;