import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import RcPagination from 'rc-pagination';
import LeftArrow from '../../icons/LeftArrow';
import RightArrow from '../../icons/RightArrow';
import PageItems from './PageItems';
import { IOption } from '../DropDown/helper';

export interface PaginationProps {
  onPageChange: (selected: number) => void;
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  wrapperClass?: string;
  nextClassName?: string;
  disabledButtonClassName?: string;
  disabledTextClassName?: string;
  previousClassName?: string;
  hidePagination?: boolean;
  itemsPerPageOptions?: IOption[];
  onItemsPerPageChanged?: (selected: number) => void;
  dropdownClassName?: string;
  optionDropdownClassName?: string;
  textDropdownClassName?: string;
}

export function Pagination({
  onPageChange,
  currentPage,
  totalItems,
  wrapperClass = '',
  nextClassName = '',
  previousClassName = '',
  disabledButtonClassName = 'text-text-disabled border-border-disabled',
  disabledTextClassName = 'text-text-disabled',
  hidePagination = false,
  itemsPerPage = 10,
  onItemsPerPageChanged = () => {},
  itemsPerPageOptions = undefined,
  dropdownClassName = '',
  optionDropdownClassName = '',
  textDropdownClassName = '',
}: PaginationProps) {
  const [activePage, setActivePage] = useState(0);
  const [pageElements, setPageElements] = useState(itemsPerPage);

  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);

  if (hidePagination) {
    return null;
  }

  const onPageChangeHandler = (page: number) => {
    setActivePage(page - 1);
    onPageChange(page - 1);
  };

  const starting = activePage > 0 ? activePage * pageElements + 1 : 1;

  const activeElements =
    totalItems >= (activePage + 1) * pageElements
      ? (activePage + 1) * pageElements
      : activePage * pageElements + (totalItems % pageElements);

  const totalNumberPages = Math.ceil(totalItems / pageElements);

  const reverseItemsPage = [...(itemsPerPageOptions || [])]?.reverse();

  const renderItem = (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: React.ReactNode,
  ): React.ReactNode =>
    type === 'page' ? (
      <div
        className={`${activePage === page - 1 ? '!border-border-dark-hover !pointer-events-none !border' : ''} label-medium text-text-dark hover:!bg-fill-pressed mr-2 flex h-6 w-auto min-w-6 cursor-pointer items-center justify-center rounded px-1`}
      >
        {page}
      </div>
    ) : (
      element
    );

  return (
    <div
      className={`flex w-full items-center justify-between px-6 py-4 ${wrapperClass}`}
    >
      <div className="flex items-center">
        {itemsPerPageOptions && (
          <PageItems
            itemsPerPage={pageElements}
            onChange={(selectedItemsPerPage) => {
              setPageElements(selectedItemsPerPage);
              onItemsPerPageChanged?.(selectedItemsPerPage);
              setActivePage(0);
            }}
            options={reverseItemsPage || []}
            dropdownClassName={dropdownClassName}
            optionDropdownClassName={optionDropdownClassName}
            textDropdownClassName={textDropdownClassName}
          />
        )}
        <div className="label-medium text-text-light mr-2">
          Result: {starting} - {activeElements} of {totalItems}
        </div>
      </div>
      <RcPagination
        current={activePage + 1}
        showTitle={false}
        total={totalItems}
        onChange={onPageChangeHandler}
        className="flex items-center"
        pageSize={pageElements}
        defaultCurrent={activePage}
        itemRender={renderItem}
        showLessItems
        jumpPrevIcon={
          <div className="text-text-disabled paragraph-medium hover:!bg-fill-pressed mr-2 w-6 cursor-pointer text-center">
            ...
          </div>
        }
        jumpNextIcon={
          <div className="text-text-disabled paragraph-medium hover:!bg-fill-pressed mr-2 w-6 cursor-pointer text-center">
            ...
          </div>
        }
        prevIcon={
          <button
            type="button"
            className={`bg-fill-fill text-icon-icon label-medium border-border-border mr-4 flex w-28 items-center justify-center rounded-lg border px-2 py-2.5 font-semibold
              ${previousClassName}
                ${
                  activePage === 0
                    ? disabledButtonClassName
                    : 'hover:bg-fill-pressed'
                }
              `}
            disabled={activePage === 0}
            tabIndex={-1}
          >
            <LeftArrow />
            <span
              className={`px-1 ${activePage === 0 ? disabledTextClassName : 'text-text-dark'}`}
            >
              Previous
            </span>
          </button>
        }
        nextIcon={
          <button
            type="button"
            className={`bg-fill-fill text-icon-icon label-medium border-border-border ml-2 flex w-28 items-center justify-center rounded-lg border px-2 py-2.5 font-semibold ${nextClassName}
              ${
                activePage === totalNumberPages - 1
                  ? disabledButtonClassName
                  : 'hover:bg-fill-pressed'
              }
            `}
            disabled={activePage === totalNumberPages - 1}
            tabIndex={-1}
          >
            <span
              className={`px-1 ${activePage === totalNumberPages - 1 ? disabledTextClassName : 'text-text-dark'}`}
            >
              Next
            </span>
            <RightArrow />
          </button>
        }
      />
    </div>
  );
}
