import React from 'react';
import { Space, Input, Form, Select } from 'antd';
import Prometheus from './Prometheus';
import ElasticSearch from './ElasticSearch';
import ClusterSelect from './components/ClusterSelect';

const cates = [
  {
    value: 'prometheus',
    label: 'Prometheus',
  },
  {
    value: 'elasticsearch',
    label: 'ElasticSearch',
  },
];

export default function index({ chartForm }) {
  return (
    <div>
      <Space style={{ marginBottom: 10 }}>
        <Input.Group>
          <span className='ant-input-group-addon'>数据源类型</span>
          <Form.Item name='datasourceCate' noStyle initialValue='prometheus'>
            <Select
              style={{ minWidth: 70 }}
              onChange={(val) => {
                if (val === 'prometheus') {
                  chartForm.setFieldsValue({
                    targets: [
                      {
                        refId: 'A',
                        expr: '',
                      },
                    ],
                  });
                } else if (val === 'elasticsearch') {
                  chartForm.setFieldsValue({
                    targets: [
                      {
                        refId: 'A',
                        index: '',
                        filters: '',
                        query: {
                          values: [
                            {
                              func: 'count',
                            },
                          ],
                          date_field: '@timestamp',
                          interval: 1,
                          interval_unit: 'min',
                        },
                      },
                    ],
                  });
                }
              }}
            >
              {cates.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Input.Group>
        <Form.Item shouldUpdate={(prev, curr) => prev.datasourceCate !== curr.datasourceCate} noStyle>
          {({ getFieldValue }) => {
            if (getFieldValue('datasourceCate') === 'elasticsearch') {
              return (
                <Input.Group>
                  <span className='ant-input-group-addon'>集群</span>
                  <ClusterSelect />
                </Input.Group>
              );
            }
            return null;
          }}
        </Form.Item>
      </Space>
      <Form.Item shouldUpdate={(prev, curr) => prev.datasourceCate !== curr.datasourceCate} noStyle>
        {({ getFieldValue }) => {
          const cate = getFieldValue('datasourceCate');
          if (cate === 'prometheus') {
            return <Prometheus chartForm={chartForm} />;
          }
          if (cate === 'elasticsearch') {
            return <ElasticSearch chartForm={chartForm} />;
          }
          return null;
        }}
      </Form.Item>
    </div>
  );
}