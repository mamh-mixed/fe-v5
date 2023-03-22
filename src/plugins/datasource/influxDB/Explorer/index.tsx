import React, { useRef } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, Space, Button, Input, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form/Form';
import { DatasourceCateEnum } from '@/utils/constant';
import TimeRangePicker from '@/components/TimeRangePicker';
import InputGroupWithFormItem from '@/components/InputGroupWithFormItem';
import Metric from './Metric';
import AdvancedSettings from '../components/AdvancedSettings';
import DBNameSelect from '../components/DBNameSelect';

interface IProps {
  datasourceCate: DatasourceCateEnum.influxDB;
  datasourceName: string;
  form: FormInstance;
}

export default function index(props: IProps) {
  const { t } = useTranslation();
  const { datasourceCate, datasourceName, form } = props;
  const metricRef = useRef<any>();

  const onExecute = () => {
    form.validateFields().then((values) => {
      if (metricRef.current && metricRef.current.fetchData) {
        metricRef.current.fetchData(datasourceCate, datasourceName, values);
      }
    });
  };

  return (
    <div>
      <Row gutter={8}>
        <Col flex='240px'>
          <InputGroupWithFormItem label={t('数据库')} labelWidth={84}>
            <Form.Item
              name={['query', 'dbname']}
              rules={[
                {
                  required: true,
                  message: t('请选择数据库'),
                },
              ]}
            >
              <DBNameSelect datasourceCate={datasourceCate} datasourceName={datasourceName} />
            </Form.Item>
          </InputGroupWithFormItem>
        </Col>
        <Col flex='auto'>
          <Space
            style={{
              display: 'flex',
            }}
          >
            <InputGroupWithFormItem
              label={
                <Space>
                  <span>{t('查询条件')}</span>
                  <Tooltip title={''}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
              labelWidth={95}
            >
              <Form.Item
                name={['query', 'command']}
                rules={[
                  {
                    required: true,
                    message: t('请输入查询条件'),
                  },
                ]}
              >
                <Input style={{ width: 500 }} />
              </Form.Item>
            </InputGroupWithFormItem>
            <Form.Item
              name={['query', 'range']}
              initialValue={{
                start: 'now-1h',
                end: 'now',
              }}
            >
              <TimeRangePicker dateFormat='YYYY-MM-DD HH:mm:ss' allowClear />
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={onExecute}>
                {t('查询')}
              </Button>
            </Form.Item>
          </Space>
        </Col>
      </Row>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const dbname = getFieldValue(['query', 'dbname']);
          if (!datasourceCate || !datasourceName || !dbname) return null;
          return <AdvancedSettings datasourceCate={datasourceCate} datasourceName={datasourceName} dbname={dbname} />;
        }}
      </Form.Item>

      <Metric ref={metricRef} />
    </div>
  );
}