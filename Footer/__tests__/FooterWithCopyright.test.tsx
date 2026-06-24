import { render } from '@testing-library/react';
import { FooterWithCopyright } from '../FooterWithCopyright';

describe('FooterWithCopyright', () => {
  it('renders correctly with copyright text', () => {
    const { baseElement } = render(
      <FooterWithCopyright copyrightText="2026 IndiaIdeas.com Limited (BillDesk)." />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('renders correctly with rights text', () => {
    const { baseElement } = render(
      <FooterWithCopyright rightsText="All Rights Reserved." />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('renders correctly with custom text component', () => {
    const { baseElement } = render(
      <FooterWithCopyright>
        <p>
          <span className="paragraph-extra-small text-text-text">
            Custom Copyright Text.
          </span>
        </p>
      </FooterWithCopyright>,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('renders correctly with dark mode', () => {
    const { baseElement } = render(
      <FooterWithCopyright
        copyrightText="2026 IndiaIdeas.com Limited (BillDesk)."
        rightsText="All Rights Reserved."
        isDarkMode
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });
});
