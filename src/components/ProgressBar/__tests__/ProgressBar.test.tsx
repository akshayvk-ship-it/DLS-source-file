import { render } from '@testing-library/react';
import { ProgressBar, ProgressBarProps } from '../ProgressBar';

describe('ProgressBar Component', () => {
  const defaultProps: ProgressBarProps = {
    isFinished: false,
    progressValue: 50,
    size: 'large',
    containerColor: 'bg-fill-pressed-dark',
    barColorConfig: {
      type: 'dual',
      color: {
        fromColor: 'from-[#FEA071]',
        toColor: 'to-fill-action',
      },
    },
    showDotEffect: true,
    time: { minTime: '1s', maxTime: '5s' },
    dataTestId: 'test-progress-bar',
  };

  test('ProgressBar Snapshot Test', () => {
    const { baseElement } = render(<ProgressBar {...defaultProps} />);
    expect(baseElement).toMatchSnapshot();
  });
});
