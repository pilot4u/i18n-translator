import React from 'react';
// project
import ScreenFooter from './../commons/ScreenFooter';
import ReactAceEditor from './../commons/ReactAceEditor';

class ExportScreen extends React.PureComponent {

  _onClickSubmitHandler (e) {
    e.preventDefault();
    this.setState({
      jsonisvalid: false,
      currentstep: this._stepsIterator.next().value
    });
  }

  _renderTextArea () {
    const string = (this.props.selectexport < 0)
      ? this.props.json
      : this.props.values[this.props.selectexport];
    const editorid = (this.props.selectexport < 0)
      ? 'diff'
      : this.props.langs[this.props.selectexport];
    return (
      <div className="application-screen-content"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          background: '#FFFFFF'
        }}>
        <div className="absolute-container" >
          <ReactAceEditor editorid={`editor-${editorid}`}
            usecopy={false}
            jsonstring={JSON.stringify(string, null, '  ')} />
        </div>
        <ScreenFooter cancelClickHandler={false}
          submitClickHandler={e => this._onClickSubmitHandler(e)} />
      </div>
    );
  }

  render () {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        {this._renderTextArea()}
      </div>
    );
  }

}

ExportScreen.contextTypes = {
  theme: React.PropTypes.object,
  facade: React.PropTypes.object
};

ExportScreen.propTypes = {
  langs: React.PropTypes.array.isRequired,
  json: React.PropTypes.object.isRequired,
  values: React.PropTypes.array.isRequired,
  selectexport: React.PropTypes.number.isRequired
};

export default ExportScreen;
