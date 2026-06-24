import { render } from '@testing-library/react';
import Download from '../../../icons/DownloadIcon';
import LeftArrow from '../../../icons/LeftArrow';
import { MwebHeader } from '../MwebHeader';

test('MWeb Header Snapshot Test', () => {
  const { baseElement } = render(
    <MwebHeader
      title="Title Text"
      leftPanelContent={
        <div>
          <LeftArrow />
        </div>
      }
      rightPanelContent={
        <div>
          <Download />
        </div>
      }
      searchBox
      searchBoxProps={{
        label: '',
        name: 'Search',
        className: 'w-40',
        value: '',
        onChange: () => {},
      }}
    />,
  );

  expect(baseElement).toMatchSnapshot();
});
