import React from 'react';
import isempty from 'lodash.isempty';
import { AllHtmlEntities as entities } from 'html-entities';
// lib
import './Application.css';
import ApplicationPopin from './ApplicationPopin';
import ApplicationFooter from './ApplicationFooter';
import ApplicationHeader from './ApplicationHeader';

class App extends React.Component {

  /* ------------------------------------------------

   Statics

  ------------------------------------------------ */

  /* ------------------------------------------------

   Constructor

  ------------------------------------------------ */

  constructor (props) {
    super(props);
    this.state = {
      json: [],
      orders: [],
      openpopin: false,
      translations: {}
    };
  }

  componentDidMount () {
    const store = this.props.facade.getStore('ApplicationStore');
    store.subscribe(s => this._onApplicationStoreChange(s));
  }

  componentWillUnmount () {
    const store = this.props.facade.getStore('ApplicationStore');
    store.unsubscribe(s => this._onApplicationStoreChange(s));
  }

  /* ------------------------------------------------

   Listeners

  ------------------------------------------------ */

  /**
   * Called when application's store emit changes
   */
  _onApplicationStoreChange ({ json, tablekeys, orders, locales, openpopin }) {
    this.setState({
      json,
      orders,
      locales,
      openpopin,
      tablekeys
    });
  }

  /**
   * Called when user enter a new value into an language/key input
   */
  _onInputChange (langkey, key, value) {
    const action = this.props.facade.getAction('ApplicationAction');
    action.updateValue({
      langkey, key, value
    });
  }

  /* ------------------------------------------------

   Privates

  ------------------------------------------------ */

  _renderInput (langkey, key, values) {
    const value = entities.decode(values[langkey][key] || '');
    return (
      <input type="text"
        style={{
          marginTop: '0',
          padding: '7px',
          width: '240px',
          marginLeft: '12px'
        }}
        defaultValue={value}
        key={`input_${key}_${langkey}`}
        onChange={e => this._onInputChange(langkey, key, e.target.value)} />
    );
  }

  _renderTranslations () {
    const orders = this.state.orders;
    const keys = this.state.tablekeys;
    const locales = this.state.locales;
    if (!locales || isempty(locales)) {
      return false;
    }
    return (
      Object.entries(keys)
        .map(([key, value]) => (
          <li key={`key_${key}`}
            style={{
              marginBottom: '22px'
            }}>
            <p style={{
              marginTop: '0',
              marginLeft: '12px',
              marginBottom: '5px'
            }}><em>{value}</em></p>
            <p style={{
              marginTop: '0',
              marginBottom: '3px'
            }}>
              {orders.map(langkey => this._renderInput(langkey, key, locales))}
            </p>
            <p style={{
              marginTop: '0',
              marginBottom: '0',
              fontSize: '0.8em',
              marginLeft: '12px'
            }}><small>{key}</small></p>
          </li>
        )
    ));
  }

  /* ------------------------------------------------

   Render Sub Components

  ------------------------------------------------ */

  _renderApplicationPopin () {
    if (!this.state.openpopin || !this.state.json) {
      return false;
    }
    return (
      <ApplicationPopin facade={this.props.facade}
        provider={this.state.json} />
    );
  }

  /* ------------------------------------------------

   Main Render

  ------------------------------------------------ */

  render () {
    return (
      <div className="application">
        <div className="flex-rows"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}>
          <ApplicationHeader langs={this.state.orders}
            facade={this.props.facade} />
          <div className="application-translations-list"
            style={{
              width: '100%',
              overflowY: 'scroll',
              overflowX: 'hidden',
              background: '#CCCCCC'
            }}>
            <ul style={{
              width: '100%',
              padding: '20px'
            }}>{this._renderTranslations()}</ul>
          </div>
          <ApplicationFooter facade={this.props.facade} />
        </div>
        {this._renderApplicationPopin()}
      </div>
    );
  }
}

App.propTypes = {
  facade: React.PropTypes.object.isRequired
};

export default App;
