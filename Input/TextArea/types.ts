import { InputHTMLAttributes, ReactNode } from 'react';

export interface TextAreaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  /** Whether the textarea is in an error state
   * @default false
   */
  error?: boolean;
  /** Whether the textarea is disabled
   * @default false
   */
  disabled?: boolean;
  /** Additional CSS class name for the wrapper element
   * @default ''
   */
  wrapperClassName?: string;
  /** Tooltip text to display on the title
   * @default null
   */
  titleToolTip?: string;
  /** Custom icon element to display in the tooltip
   * @default null
   */
  iconToolTip?: JSX.Element;
  /** Additional CSS class name for the tooltip
   * @default ''
   */
  classNameToolTip?: string;
  /** Whether to always show the tooltip
   * @default false
   */
  alwaysShowTooltip?: boolean;
  /** Content to display in the tooltip (can be string or JSX element)
   * @default null
   */
  contentToolTip?: JSX.Element | string;
  /** Custom tooltip or content string to render
   * @default null
   */
  renderCustomContentToolTip?: JSX.Element;
  /** Icon element to display as suffix
   * @default null
   */
  suffixIcon?: JSX.Element;
  /** Placeholder text to display when the textarea is empty
   * @default ''
   */
  placeholder?: string;
  /** Ref object for the wrapper div element
   * @default null
   */
  wrapperElementRef?: React.RefObject<HTMLDivElement>;
  /** Type of tooltip to display
   * - 'plain': Simple tooltip
   * - 'contextual': Contextual tooltip with more information
   * @default 'plain'
   */
  toolTipType?: 'plain' | 'contextual';
  /** Whether autocomplete is enabled for the textarea
   * @default true
   */
  isAutoCompleteEnabled?: boolean;
  /** Current value of the textarea
   * @required
   */
  value: string;
  /** Label text to display above the textarea
   * @default null
   */
  label?: string;
  /** Additional CSS class name for the label element
   * @default ''
   */
  labelClassName?: string;
  /** Whether to show the info icon next to the label
   * @default true
   */
  showLabelInfoIcon?: boolean;
  /** Whether the textarea can be resized by the user
   * @default true
   */
  isResizable?: boolean;
  /** Whether the textarea is read-only
   * @default false
   */
  readOnly?: boolean;
  /** Name attribute for the textarea element
   * @required
   */
  name: string;
  /** Callback function triggered when the textarea value changes
   * @param e - The change event
   * @param isMaxLengthExceeded - Whether the max character limit has been exceeded
   * @required
   */
  onValueChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    isMaxLengthExceeded: boolean,
  ) => void;
  /** Callback function triggered when the textarea loses focus
   * @param e - The blur event
   * @default null
   */
  onBlur?: (e?: React.FocusEvent<HTMLTextAreaElement>) => void;
  /** Callback function triggered when the textarea wrapper is clicked
   * @param e - The mouse event
   * @default null
   */
  onTextAreaClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Callback function triggered when the textarea gains focus
   * @default null
   */
  onFocus?: () => void;
  /** Additional CSS class name for the textarea element
   * @default ''
   */
  textAreaClassName?: string;
  /** Ref object for the textarea wrapper div element
   * @default null
   */
  textAreaWrapperElementRef?: React.RefObject<HTMLDivElement>;
  /** Additional CSS class name for the textarea wrapper element
   * @default ''
   */
  textAreaWrapperClassName?: string;
  /** Element to display as a suffix inside the textarea at the right bottom side
   * @default null
   */
  suffixElement?: ReactNode;
  /** Helper text to display below the textarea
   * @default null
   */
  helperText?: string;
  /** Error message to display below the textarea when in error state
   * @default null
   */
  errorHelperText?: string;
  /** Maximum number of characters allowed in the textarea. If the value is 0, no character length will be shown on the
   * right side
   * @default null
   */
  maxCharacterLimit?: number;
  /**
   * Data Test Id for the component
   */
  dataTestId?: string;
}
