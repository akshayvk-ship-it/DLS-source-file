export type ListCellTypes = 'Outlined' | 'NotOutlined';

export default function getColors(
  emphasis: boolean,
  outlined: boolean,
  selected: boolean,
) {
  const colors = {
    Selected: {
      Emphasis: ` font-medium ${outlined ? ' border border-border-action-focused bg-fill-action-lighter hover:bg-fill-action-lighter-pressed' : ' bg-fill-action-light hover:bg-fill-action-light'}`,
      NotEmphasis: ` font-medium bg-fill-pressed-dark hover:bg-fill-pressed-dark ${outlined ? 'border border-border-border ' : ''}`,
    },
    NotSelected: {
      Emphasis: ` font-normal hover:bg-fill-action-lighter-pressed ${outlined ? 'border border-border-border-light hover:border-border-brand-focus-ring' : ''}`,
      NotEmphasis: ` bg-fill-fill font-normal hover:bg-fill-hover-light ${outlined ? 'border border-border-border-light' : ''}`,
    },
  };

  return `${colors[selected ? 'Selected' : 'NotSelected'][emphasis ? 'Emphasis' : 'NotEmphasis']}`;
}
