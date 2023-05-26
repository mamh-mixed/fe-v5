/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getSsoConfig, getRedirectURL, getRedirectURLCAS, getRedirectURLOAuth } from '@/services/login';
import './login.less';
import { useTranslation } from 'react-i18next';
export interface DisplayName {
  oidc: string;
  cas: string;
  oauth: string;
}
export default function Login() {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const redirect = location.search && new URLSearchParams(location.search).get('redirect');
  const dispatch = useDispatch();
  const [displayName, setDis] = useState<DisplayName>({
    oidc: 'OIDC',
    cas: 'CAS',
    oauth: 'OAuth',
  });
  useEffect(() => {
    getSsoConfig().then((res) => {
      if (res.dat) {
        setDis({
          oidc: res.dat.oidcDisplayName,
          cas: res.dat.casDisplayName,
          oauth: res.dat.oauthDisplayName,
        });
      }
    });
  }, []);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      login();
    } catch {
      console.log(t('输入有误'));
    }
  };

  const login = async () => {
    let { username, password } = form.getFieldsValue();
    const err = await dispatch({
      type: 'account/login',
      username,
      password,
    });
    if (!err) {
      history.push(redirect || '/metric/explorer');
    }
  };

  return (
    <div className='login-warp'>
      {/* <img src={'/image/login-left-top-corner.png'} className='left-top-bg'></img> */}
      {/* <img src={'/image/login-right-bottom-corner.png'} className='right-bottom-bg'></img> */}
      <div className='banner integration'>
        <div className='banner-logo'>
          <img src='/image/nightingale.svg' />
        </div>
        <div className='banner-image'>
          <img src={'/image/login-dashboard.svg'} />
        </div>
      </div>
      <div className='login-panel'>
        <div className='login-main  integration'>
          <div className='login-title'>
            <div style={{ textAlign: 'left' }}>欢迎登录 Nightingale</div>
          </div>
          <Form form={form} layout='vertical' requiredMark={true}>
            <Form.Item
              name='username'
              validateTrigger={['onBlur']}
              rules={[
                {
                  required: true,
                  message: t('请输入用户名'),
                },
              ]}
            >
              <Input placeholder={t('请输入用户名')} />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: t('请输入密码'),
                },
              ]}
            >
              <Input type='password' placeholder={t('请输入密码')} onPressEnter={handleSubmit} />
            </Form.Item>

            <Form.Item>
              <Button type='primary' onClick={handleSubmit} style={{ opacity: 0.9, background: 'linear-gradient(19deg, #694DF4 0%, #A343F5 100%)', marginTop: 8 }}>
                {t('登录')}
              </Button>
            </Form.Item>

            <div className='login-other'>
              <strong>{t('其他登录方式：')}</strong>
              <a
                onClick={() => {
                  getRedirectURL().then((res) => {
                    if (res.dat) {
                      window.location.href = res.dat;
                    } else {
                      message.warning(t('没有配置 OIDC 登录地址！'));
                    }
                  });
                }}
              >
                {displayName.oidc}
              </a>
              &nbsp;&nbsp;
              <a
                onClick={() => {
                  getRedirectURLCAS().then((res) => {
                    if (res.dat) {
                      window.location.href = res.dat.redirect;
                      localStorage.setItem('CAS_state', res.dat.state);
                    } else {
                      message.warning(t('没有配置 CAS 登录地址！'));
                    }
                  });
                }}
              >
                {displayName.cas}
              </a>
              &nbsp;&nbsp;
              <a
                onClick={() => {
                  getRedirectURLOAuth().then((res) => {
                    if (res.dat) {
                      window.location.href = res.dat;
                    } else {
                      message.warning(t('没有配置 OAuth 登录地址！'));
                    }
                  });
                }}
              >
                {displayName.oauth}
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
