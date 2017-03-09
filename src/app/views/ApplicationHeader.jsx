import React from 'react';
import { GithubStarButton, TwitterShareButton } from 'flux-core-lib';
// project
import logo from './../../assets/json_logo.svg';

const ApplicationHeader = props => (
  <div className="application-header flex-columns flex-space-around"
    style={{
      textAlign: 'left',
      position: 'relative',
      padding: '20px 32px 20px 32px'
    }}>
    <div className="flex-columns flex-centered">
      <a href="/">
        <img alt="i18n Online Translations Editor (JSON)"
          style={{
            width: '60px',
            height: '60px',
            marginRight: '10px',
            verticalAlign: 'bottom'
          }}
          src={logo} />
      </a>
      <div>
        <h1 style={{
          margin: '0',
          lineHeight: '1.25em',
          fontWeight: 'normal'
        }}>
          <span>i18n Online Translations Editor (JSON)</span>
        </h1>
        <h2 style={{
          margin: '0',
          color: '#8e8e8e',
          marginTop: '7px',
          fontWeight: 'normal',
          fontSize: '1.285715em'
        }}>
          <span>Create/Update your languages files in a simple way</span>
        </h2>
      </div>
    </div>
    <div style={{
      right: '32px',
      position: 'absolute'
    }}>
      <span style={{
        marginRight: '12px'
      }}>
        <TwitterShareButton username="sixertoy"
          projecturl={`https://sixertoy.github.io/${props.appname}`} />
      </span>
      <span>
        <GithubStarButton username="sixertoy"
          projectname={props.appname} />
      </span>
    </div>
  </div>
);

ApplicationHeader.propTypes = {
  appname: React.PropTypes.string.isRequired
};

export default ApplicationHeader;
