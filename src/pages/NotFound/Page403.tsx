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
import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
const NotFound: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Result
        title='403'
        subTitle={t('你没有权限访问该页面, 请联系管理员!')}
        extra={
          <Button type='primary' onClick={() => history.go(-2)}>
            {t('返回上一页')}
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
