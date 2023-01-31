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

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { OktaAuth } from '@okta/okta-auth-js';

import config from './config';

config.oidc_one.restoreOriginalUri = async (oktaAuth, originalUri) => {
  // redirect with custom router
  window.location = '/profileone';
}
const oktaAuth2 = new OktaAuth(config.oidc_one);

const Tokensone = () => {

  const history = useHistory();
  
  useEffect(async() => {
    //oktaAuth.options.storageManager.token.storageKey = "okta-token-storage-one";
    await oktaAuth2.handleLoginRedirect();
    //const { tokens } = await oktaAuth2.token.parseFromUrl(); // remember to "await" this async call
    //oktaAuth2.tokenManager.setTokens(tokens);
    history.push('/profileone');
    return () => {};
  }, [oktaAuth2]);

  return (
    <div>
      Callback
    </div>
  );
};

export default Tokensone;
