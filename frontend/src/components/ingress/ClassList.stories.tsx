import { Meta, Story } from '@storybook/react';
import { useMockListQuery } from '../../helpers/testHelpers';
import { KubeObject } from '../../lib/k8s/cluster';
import IngressClass from '../../lib/k8s/ingressClass';
import { TestContext } from '../../test';
import ListView from './ClassList';
import { RESOURCE_DEFAULT_INGRESS_CLASS, RESOURCE_INGRESS_CLASS } from './storyHelper';

IngressClass.useListQuery = useMockListQuery.data(
  [RESOURCE_INGRESS_CLASS, RESOURCE_DEFAULT_INGRESS_CLASS].map(
    (data: KubeObject) => new IngressClass(data)
  )
);

export default {
  title: 'IngressClass/ListView',
  component: ListView,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: Story = () => {
  return <ListView />;
};

export const Items = Template.bind({});
