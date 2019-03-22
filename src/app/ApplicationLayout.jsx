/* globals ga */
import React from 'react';
import Helmet from 'react-helmet';
import isempty from 'lodash.isempty';
// lib
import GoogleAnalytics from './../core/views/GoogleAnalytics';
import GithubOctocatCorner from './../core/views/GithubOctocatCorner';
// application
import './Application.css';
import Constants from './constants';
import ApplicationMenu from './views/ApplicationMenu';
import ApplicationFooter from './views/ApplicationFooter';
import ApplicationHeader from './views/ApplicationHeader';
// screens
import ImportScreen from './views/screens/ImportScreen';
import ExportScreen from './views/screens/ExportScreen';
import ConnectScreen from './views/screens/ConnectScreen';
import LocalesTable from './views/locales-table/LocalesTable';

class ApplicationLayout extends React.Component {

  /* ------------------------------------------------

   Statics

  ------------------------------------------------ */

  /* ------------------------------------------------

   Constructor

  ------------------------------------------------ */

  constructor (props) {
    super(props);
    this.state = {
      json: {},
      langs: [],
      values: [],
      primarykeys: [],
      selectexport: 0,
      // default/home screen
      openscreen: Constants.SCREENS.CONNECT
    };
  }

  getChildContext () {
    return {
      facade: this.props.facade,
      theme: {
        grey: '#B9B9B9',
        love: '#DD4739',
        metal: '#34495E',
        velvet: '#661E75',
        greylight: '#EEEEEE'
      }
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
  _onApplicationStoreChange (state) {
    this.setState({
      json: state.json,
      langs: state.langs,
      values: state.values,
      collapsed: state.collapsed,
      openscreen: state.openscreen,
      primarykeys: state.primarykeys,
      selectexport: state.selectexport
    });
  }

  /* ------------------------------------------------

   Render Sub Components

  ------------------------------------------------ */

  _renderApplicationScreen () {
    let view;
    // eslint-disable-next-line
    // console.log('DEBUG :: this.props.openscreen', this.state.openscreen);
    switch (this.state.openscreen) {
    case Constants.SCREENS.IMPORT:
      view = (
        <ImportScreen facade={this.context.facade}
          title={'Create a new language set'}
          langs={this.state.langs}
          primarykeys={this.state.primarykeys} />
        );
      break;
    case Constants.SCREENS.EXPORT:
      view = (
        <ExportScreen facade={this.context.facade}
          title={'Export languages'}
          json={this.state.json}
          langs={this.state.langs}
          values={this.state.values}
          selectexport={this.state.selectexport} />
        );
      break;
    case Constants.SCREENS.EDIT:
      view = (
        <LocalesTable facade={this.context.facade}
          langs={this.state.langs}
          values={this.state.values}
          collapsed={this.state.collapsed}
          primarykeys={this.state.primarykeys} />
      );
      break;
    default:
    case Constants.SCREENS.CONNECT:
      view = (
        <ConnectScreen facade={this.context.facade}
          title={'Export languages'}
          json={this.state.json}
          langs={this.state.langs}
          values={this.state.values} />
        );
      break;
    }
    return view;
  }

  /* ------------------------------------------------

   Main Render

  ------------------------------------------------ */

  render () {
    const classes = isempty(this.state.primarykeys)
      ? 'flex-centered'
      : 'flex-start';
    return (
      <div className="application"
        style={{
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          position: 'absolute'
        }}>
        <Helmet meta={[{
          name: 'description',
          content: 'Helmet application'
        }, {
          property: 'og:type',
          content: 'article'
        }]} />
        <div className="flex-rows"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}>
          <div className="shadow-bottom"
            style={{
              width: '100%',
              position: 'relative',
              background: '#FBFBFB'
            }}>
            {/* <ApplicationHeader appname={this.props.appname} /> */}
          </div>
          {<ApplicationMenu langs={this.state.langs}
            selectexport={this.state.selectexport}
            canexport={!isempty(this.state.values)}
            canadd={this.state.openscreen !== Constants.SCREENS.CONNECT}
            isexport={this.state.openscreen === Constants.SCREENS.EXPORT}
            canshow={this.state.openscreen !== Constants.SCREENS.CONNECT} />}
          <div className={`application-layout-content flex-grow-and-shrink flex-rows ${classes}`}
            style={{
              width: '100%',
              height: '100%',
              fontSize: '1.2em',
              position: 'relative',
              background: '#FBFBFB'
            }}>
            {this._renderApplicationScreen()}
          </div>
          <ApplicationFooter version={this.props.version}
            canexport={!isempty(this.state.primarykeys)} />
        </div>
        <GithubOctocatCorner direction="left"
          username="sixertoy"
          projectname="i18n-translator" />
        <GoogleAnalytics onload={() => {
          ga('create', 'UA-92648806-1', 'auto');
          ga('send', 'pageview', 'index.html');
        }} />
      </div>
    );
  }
}

ApplicationLayout.childContextTypes = {
  theme: React.PropTypes.object,
  facade: React.PropTypes.object
};

ApplicationLayout.propTypes = {
  appname: React.PropTypes.string.isRequired,
  version: React.PropTypes.string.isRequired,
  facade: React.PropTypes.object.isRequired
};

export default ApplicationLayout;
