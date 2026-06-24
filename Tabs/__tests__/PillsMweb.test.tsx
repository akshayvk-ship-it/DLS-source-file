import { render, screen } from '@testing-library/react';
import { PillsMweb } from '../PillsMweb';

describe('PillsMweb', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const tabs = ['Test name 1', 'Test name 2', 'Test name 3', 'Test name 4'];

  it('Render Pills Mweb', () => {
    render(<PillsMweb tabs={tabs} onChange={() => {}} />);
    expect(screen.getByTestId('pills-mweb-test-id')).toMatchSnapshot();
  });
});
