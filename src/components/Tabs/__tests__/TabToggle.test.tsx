import { render } from '@testing-library/react';
import { TabToggle } from '../TabToggle';

describe('TabToggle Snapshot', () => {
  it('matches snapshot with default props', () => {
    const { asFragment } = render(
      <TabToggle tabs={['Tab 1', 'Tab 2', 'Tab 3']} onChange={() => {}} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with custom class names and defaultActiveTab', () => {
    const { asFragment } = render(
      <TabToggle
        tabs={['Overview', 'Details']}
        onChange={() => {}}
        className="custom-tabs"
        highlighterClassName="custom-highlighter"
        tabClassName={(selected) => (selected ? 'active' : 'inactive')}
        defaultActiveTab={1}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
