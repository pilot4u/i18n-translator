/* @flow */
import React from 'react';
// punkbeer

class ApplicationCreateScreen extends React.PureComponent {

  getChildContext () {
    return {};
  }

  constructor (props, context) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps, nextContext) {}

  shouldComponentUpdate(nextProps, nextState, nextContext)  {}

  componentWillUpdate(nextProps, nextState, nextContext) {}

  componentDidUpdate(prevProps, prevState, prevContext) {}

  render () {
    return (
      <div></div>
    );
  }

}

ApplicationCreateScreen.propTypes = {
  facade: React.PropTypes.object.isRequired
};

ApplicationCreateScreen.defaultProps = {};

ApplicationCreateScreen.childContextTypes = {};

export default ApplicationCreateScreen;