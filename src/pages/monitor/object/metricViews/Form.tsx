import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Modal, Form, Input, Space, Button, Table, Select, message } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ModalHOC, { ModalWrapProps } from '@/components/ModalHOC';
import { getLabels, getLabelValues, addMetricView, updateMetricView } from '@/services/metricViews';
import { Range } from '@/components/DateRangePicker';

interface IProps {
  action: 'add' | 'edit';
  initialValues: any;
  range: Range;
}

const titleMap = {
  add: '新建快捷视图',
  edit: '编辑快捷视图',
};

function FormCpt(props: ModalWrapProps & IProps) {
  const { action, visible, initialValues, destroy, range, onOk } = props;
  const [form] = Form.useForm();
  const [labels, setLabels] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const getLablesOptions = () => {
    return _.map(labels, (label) => {
      return (
        <Select.Option key={label} value={label}>
          {label}
        </Select.Option>
      );
    });
  };

  useEffect(() => {
    getLabels('', range).then((res) => {
      setLabels(res);
    });
  }, [JSON.stringify(range)]);

  return (
    <Modal
      title={titleMap[action]}
      visible={visible}
      onCancel={() => {
        destroy();
      }}
      onOk={() => {
        form.validateFields().then((values) => {
          const _values = _.cloneDeep(values);
          _values.dynamicLabels = _.map(_values.dynamicLabels, (item) => {
            return {
              label: item,
              value: '',
            };
          });
          const { name } = _values;
          const configs = JSON.stringify(_.omit(_values, 'name'));
          const data: any = {
            name,
            configs,
          };
          if (action === 'add') {
            addMetricView(data).then(() => {
              message.success('添加成功');
              onOk();
              destroy();
            });
          } else if (action === 'edit') {
            data.id = initialValues.id;
            updateMetricView(data).then(() => {
              message.success('修改成功');
              onOk();
              destroy();
            });
          }
        });
      }}
    >
      <Form layout='vertical' initialValues={initialValues} form={form}>
        <Form.Item label='视图名称' name='name' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.List name='filters'>
          {(fields, { add, remove }) => (
            <>
              <div style={{ paddingBottom: 8 }}>
                前置过滤条件{' '}
                <PlusCircleOutlined
                  onClick={() => {
                    add({
                      oper: '=',
                    });
                  }}
                />
              </div>
              {fields.map(({ key, name }) => {
                return (
                  <Space key={key}>
                    <Form.Item name={[name, 'label']} rules={[{ required: true }]}>
                      <Select allowClear showSearch style={{ width: 170 }}>
                        {getLablesOptions()}
                      </Select>
                    </Form.Item>
                    <Form.Item name={[name, 'oper']} rules={[{ required: true }]}>
                      <Select style={{ width: 60 }}>
                        <Select.Option value='='>=</Select.Option>
                        <Select.Option value='!='>!=</Select.Option>
                        <Select.Option value='=~'>=~</Select.Option>
                        <Select.Option value='!~'>!~</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={[name, 'value']} rules={[{ required: true }]}>
                      <Input style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item>
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                        }}
                      />
                    </Form.Item>
                  </Space>
                );
              })}
            </>
          )}
        </Form.List>
        <Form.Item label='动态过滤标签' name='dynamicLabels'>
          <Select allowClear showSearch mode='multiple'>
            {getLablesOptions()}
          </Select>
        </Form.Item>
        <Form.Item label='展开维度标签' name={['dimensionLabel', 'label']} rules={[{ required: true }]}>
          <Select allowClear showSearch>
            {getLablesOptions()}
          </Select>
        </Form.Item>
        <div style={{ textAlign: 'right', marginBottom: 10 }}>
          <Button
            onClick={() => {
              const values = form.getFieldsValue();
              setPreviewVisible(true);
              setPreviewLoading(true);
              const _labels = _.compact(_.concat(values.dynamicLabels, values.dimensionLabel?.label));
              const requests = _.map(_labels, (item) => {
                return getLabelValues(item, range);
              });
              Promise.all(requests).then((res) => {
                const data = _.map(_labels, (item, idx) => {
                  return {
                    label: item,
                    values: res[idx],
                  };
                });
                setPreviewData(data);
                setPreviewLoading(false);
              });
            }}
          >
            预览
          </Button>
        </div>
        {previewVisible && (
          <Table
            size='small'
            rowKey='label'
            columns={[
              {
                title: 'Lable Key',
                dataIndex: 'label',
              },
              {
                title: 'Lable Value 数量',
                dataIndex: 'values',
                render: (text) => {
                  return text.length;
                },
              },
              {
                title: 'Lable Value 样例',
                dataIndex: 'values',
                render: (text) => {
                  return _.head(text);
                },
              },
            ]}
            dataSource={previewData}
            loading={previewLoading}
          />
        )}
      </Form>
    </Modal>
  );
}

export default ModalHOC(FormCpt);