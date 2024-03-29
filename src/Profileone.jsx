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

import React, { useState, useEffect } from 'react';
import { Header, Icon, Table } from 'semantic-ui-react';
import { useOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';

import config from './config';

const oktaAuth2 = new OktaAuth(config.oidc_one);
//oktaAuth2.options.storageManager.token.storageKey = "okta-token-storage-one";

const Profileone = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [userInfo2, setUserInfo2] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [tokenInfo2, setTokenInfo2] = useState(null);

  const { clientId } = config.oidc;
  const { clientId:clientId2 } = config.oidc_one;

  useEffect(async() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated at all, forget any user info
      setUserInfo(null);
    } else {
      const authStateOne = await oktaAuth2.authStateManager.updateAuthState();
      if(!authStateOne || !authStateOne.isAuthenticated){
        // When user isn't authenticated at the child application
        oktaAuth2.signInWithRedirect();
      }else{
        oktaAuth2.getUser().then((info) => {
          setUserInfo2(info);
          setTokenInfo2(oktaAuth2.tokenManager.getTokensSync().accessToken.accessToken);
          
        }).catch((err) => {
          console.error(err);
        });
      }
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
        setTokenInfo(oktaAuth.tokenManager.getTokensSync().accessToken.accessToken);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [authState, oktaAuth, oktaAuth2]);

  if (!userInfo) {
    return (
      <div>
        <p>Fetching user profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Header as="h1">
          <Icon name="drivers license" />
          {' '}
          My User Profile App #2 (ID Token Claims)
          {' '}
        </Header>
        <p>
          Below is the information from your ID token which was obtained during the &nbsp;
          <a href="https://developer.okta.com/docs/guides/implement-auth-code-pkce">PKCE Flow</a>
          {' '}
          and is now stored in local storage.
        </p>
        <p>
          This route is protected with the
          {' '}
          <code>&lt;SecureRoute&gt;</code>
          {' '}
          component, which will ensure that this page cannot be accessed until you have authenticated.
        </p>
        <p>
          APP ID (MAIN): {clientId}
        </p>
        <p>
          Access Token (MAIN): {tokenInfo}          
        </p>
        
        <Table>
          <thead>
            <tr>
              <th>Claim</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userInfo).map((claimEntry) => {
              const claimName = claimEntry[0];
              const claimValue = claimEntry[1];
              const claimId = `claim-${claimName}`;
              return (
                <tr key={claimName}>
                  <td>{claimName}</td>
                  <td id={claimId}>{claimValue.toString()}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <br/>
        <br/>
        {userInfo2?
          <>
            <p>
              APP ID (2): {clientId2}
            </p>
            <p>
             Access Token (2): {tokenInfo2}          
            </p>

            <Table>
              <thead>
                <tr>
                  <th>Claim</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(userInfo2).map((claimEntry) => {
                  const claimName = claimEntry[0];
                  const claimValue = claimEntry[1];
                  const claimId = `claim-${claimName}`;
                  return (
                    <tr key={claimName}>
                      <td>{claimName}</td>
                      <td id={claimId}>{claimValue.toString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
          :
          <div>
            <p>Fetching user profile...</p>
          </div>
        }
      </div>
    </div>
  );
};

export default Profileone;
