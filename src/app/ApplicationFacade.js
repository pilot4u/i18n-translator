import React from 'react';
import ReactDOM from 'react-dom';
import { AbstractFacade } from 'flux-core-lib';
// core
import stores from './stores';
import actions from './actions';
import services from './services';
import observers from './observers';
import routesActions from './routes';
import ApplicationLayout from './ApplicationLayout';

class ApplicationFacade extends AbstractFacade {

  start ({ name, version }) {
    this._beforeStart({
      services,
      stores,
      actions,
      routesActions,
      observers
    });
    // eslint-disable-next-line
    ReactDOM.render(<ApplicationLayout appname={name}
      version={version}
      facade={this} />, document.getElementById('root'));
  }

}

export default ApplicationFacade;
