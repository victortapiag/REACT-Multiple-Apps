/*
 * Copyright (c) 2018-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React, { useEffect, useRef } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import logo from './logo.svg';

import config from './config';

const Login = ({ setCorsErrorModalOpen }) => {
  const { oktaAuth } = useOktaAuth();
  const widgetRef = useRef();

  // Fetch otp and state from query params from email callback verification URI
  // Application should have http://localhost:8080/login as the email callback verification URI
  const queryParams = new URLSearchParams(window.location.search);
  const otp = queryParams.get('otp');
  const state = queryParams.get('state');
  //const state = 'apple';

  useEffect(() => {
    if (!widgetRef.current) {
      return false;
    }

    const { issuer, clientId, redirectUri, scopes, useInteractionCode } = config.oidc;
    const widget = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an OIDC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: issuer.split('/oauth2')[0],
      clientId,
      redirectUri,
      logo,
      language: 'en',
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to React & Company',
        },
      },
      authParams: {
        // To avoid redirect do not set "pkce" or "display" here. OKTA-335945
        issuer,
        scopes,
        tokenManager: {
          storage: 'sessionStorage'
        },
        responseType: ['id_token', 'token', 'code'],
      },
      useInteractionCodeFlow: useInteractionCode, // Set to true, if your org is OIE enabled
      state,
      otp,
      features: {
        registration: true,
        scrollOnError: false,
      }

      
     /* baseUrl: "https://id.azamara.online",
        clientId,
        redirectUri,
        //state: 'eyJzdGF0ZU5vbmNlIjoiNjc0YTg2NzYtMGE5Yi00NmIzLWI2N2QtZjg5NjAxODI4MzY5In0=',
        //codeChallenge: 'GSNpg1qhUxzscLy6AF3LuS5P7wBxREYf_SSvLMqj7xA',
        state,
        otp,
        useInteractionCodeFlow: true,
        language: 'en',
        authParams: {
            issuer: 'https://id.azamara.online/oauth2/default/',
            responseType: ['id_token', 'token', 'code'],
            scopes: ['openid', 'email', 'profile'],
            tokenManager: {
                storage: 'sessionStorage'
            }
        },
        logo: '/static-assets/images/logos/azamara-logo.png',
        i18n: {
                                        en: {
                                        // Labels
                                        'primaryauth.title': 'Log in to your account',
                                        'primaryauth.username.placeholder': 'Email',
                                        'primaryauth.password.placeholder': 'Password',
                                        // Errors
                                        'error.username.required': 'Please enter an email address',
                                        'error.password.required': 'Please enter a password',
                                        'errors.E0000004': 'Log in failed!'
                                        }
                                        },
        features: {
                                            registration: true,
                                            scrollOnError: false,
                                        },
    */
    });

    widget.showSignInAndRedirect({
      el: widgetRef.current
  }).catch(function(error) {
      // This function is invoked with errors the widget cannot recover from:
      // Known errors: CONFIG_ERROR, UNSUPPORTED_BROWSER_ERROR
  });

    /*widget.renderEl(
      { el: widgetRef.current },
      (res) => {
        oktaAuth.handleLoginRedirect(res.tokens);
      },
      (err) => {
        throw err;
      },
    );*/

    // Note: Can't distinguish CORS error from other network errors
    const isCorsError = (err) => (err.name === 'AuthApiError' && !err.statusCode);

    widget.on('afterError', (_context, error) => {
      if (isCorsError(error)) {
        setCorsErrorModalOpen(true);
      }
    });

    return () => widget.remove();
  }, [oktaAuth]);

  return (
    <div>
      <div ref={widgetRef} />
    </div>
  );
};

export default Login;
