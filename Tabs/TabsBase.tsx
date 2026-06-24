import React, {
  KeyboardEvent,
  MouseEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ContainerProps,
  HighlighterProps,
  StatusTabs,
  TabChangeHandler,
  TabChangeHandlerStatusTabs,
  TabProps,
} from './types';

export type StatusTabsProps =
  | {
      showStatusTabs?: false | undefined;
      tabs: string[];
      onChange: TabChangeHandler;
    }
  | {
      showStatusTabs: true;
      tabs: StatusTabs[];
      onChange: TabChangeHandlerStatusTabs;
    };

export type TabBaseProps = StatusTabsProps & {
  Highlighter: React.FC<HighlighterProps>;
  Tab: React.FC<TabProps>;
  Container: React.ForwardRefExoticComponent<
    ContainerProps & React.RefAttributes<HTMLDivElement>
  >;
  dataTestId?: string;
  className?: string;
  highlighterClassName?: string;
  tabClassName?: (selected: boolean) => string;
  defaultActiveTab?: number;
  activeTab?: number;
  highlighterShadowColor?: string;
  disableTab?: number;
  isDisabled?: boolean;
  size?: 'sm' | 'lg';
};

type HighlighterDataProp = Omit<
  HighlighterProps,
  'className' | 'highlighterShadowColor'
>;

export const TabsBase = forwardRef<HTMLDivElement, TabBaseProps>(
  (
    {
      tabs,
      Highlighter,
      Tab,
      Container,
      onChange,
      dataTestId,
      className,
      highlighterClassName,
      tabClassName,
      defaultActiveTab = 0,
      activeTab,
      highlighterShadowColor,
      disableTab,
      isDisabled,
      showStatusTabs,
      size,
    }: TabBaseProps,
    ref,
  ) => {
    const [currTab, setCurrTab] = useState(activeTab ?? defaultActiveTab ?? 0);
    const [highlighterData, setHighlighterData] = useState<HighlighterDataProp>(
      {
        left: '0',
        width: '0',
      },
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();

    const handleClick = (
      e: MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
      index: number,
    ) => {
      if (e.type === 'keydown' && (e as KeyboardEvent).key !== 'Enter') return;

      const tab = e.currentTarget;

      const currentTab = tabs[index];

      if (showStatusTabs) {
        ((handler: TabChangeHandlerStatusTabs, value: StatusTabs) => {
          handler(value, index);
        })(onChange, currentTab as StatusTabs);
      } else {
        ((handler: TabChangeHandler, value: string) => {
          handler(value, index);
        })(onChange, currentTab as string);
      }

      setCurrTab(index);
      requestAnimationFrame(() => {
        setHighlighterData({
          left: `${tab.offsetLeft}px`,
          width: `${tab.clientWidth}px`,
        });
      });

      try {
        tab.scrollIntoView({ inline: 'center', block: 'nearest' });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // handle error
      }
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container?.children) return () => {};

      function updateHighlighter() {
        const tabElements =
          container?.children as HTMLCollectionOf<HTMLDivElement>;
        const currentTab = tabElements?.[currTab];
        if (currentTab) {
          setHighlighterData({
            left: `${currentTab.offsetLeft}px`,
            width: `${currentTab.clientWidth}px`,
            disabled: disableTab === currTab,
          });
        }
      }

      let mounted = true;

      if (document.fonts) {
        document.fonts.ready
          .then(() => {
            if (mounted) {
              requestAnimationFrame(() => updateHighlighter());
            }
          })
          .catch(() => {
            /* nothing to do */
          });
      } else {
        requestAnimationFrame(() => updateHighlighter());
      }

      return () => {
        mounted = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (
        activeTab === undefined ||
        activeTab === null ||
        tabs.length - 1 < activeTab
      )
        return;

      // Cancel any pending animation frame before creating a new one
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const tabElements = (
        (ref as React.MutableRefObject<HTMLDivElement>) || containerRef
      ).current?.children;

      const selectedTab = tabElements?.[activeTab] as
        | HTMLDivElement
        | undefined;
      if (selectedTab) {
        setCurrTab(activeTab);

        animationFrameRef.current = requestAnimationFrame(() => {
          const highlighterInfo: HighlighterDataProp = {
            left: `${selectedTab.offsetLeft}px`,
            width: `${selectedTab.clientWidth}px`,
          };

          if (disableTab === activeTab) {
            highlighterInfo.disabled = true;
          }

          setHighlighterData(highlighterInfo);

          try {
            if (disableTab === activeTab) return;
            selectedTab.scrollIntoView({ inline: 'center', block: 'nearest' });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            // handle error
          }
        });
      }
    }, [activeTab, defaultActiveTab, disableTab, ref, tabs.length]);

    useEffect(() => {
      if (disableTab === defaultActiveTab && disableTab === currTab) {
        setHighlighterData((prev) => ({
          ...prev,
          disabled: true,
        }));
      }
    }, [currTab, defaultActiveTab, disableTab]);

    return (
      <Container
        className={`scroll-hidden relative flex w-full max-w-fit overflow-auto scroll-smooth ${className}`}
        ref={ref || containerRef}
        isDisabled={isDisabled}
        dataTestId={dataTestId}
      >
        {tabs.map((value, index) => (
          <Tab
            key={`${typeof value === 'string' ? value : value.label}`}
            value={value}
            active={currTab === index && disableTab !== index}
            index={index + 1}
            isDisabled={isDisabled}
            onClick={
              disableTab !== index ? (e) => handleClick(e, index) : () => {}
            }
            onKeyDown={
              disableTab !== index ? (e) => handleClick(e, index) : () => {}
            }
            className={tabClassName}
            size={size}
          />
        ))}
        <Highlighter
          {...highlighterData}
          disabled={highlighterData.disabled || isDisabled}
          className={highlighterClassName}
          highlighterShadowColor={highlighterShadowColor}
          size={size}
        />
      </Container>
    );
  },
);
