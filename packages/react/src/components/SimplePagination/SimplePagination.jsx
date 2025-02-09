import React from 'react';
import PropTypes from 'prop-types';
import { CaretLeft16, CaretRight16 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import { handleEnterKeyDown } from '../../utils/componentUtilityFunctions';

const { iotPrefix, prefix } = settings;

export const SimplePaginationPropTypes = {
  /** current page number */
  page: PropTypes.number.isRequired,
  /** The maximum page number that can be navigated to */
  maxPage: PropTypes.number.isRequired,
  /** Gets called back with arguments (page, maxPage) */
  pageOfPagesText: PropTypes.func,
  /** Internationalized label for the word 'Page' */
  pageText: PropTypes.string,
  /** Internationalized label for the word 'Next page' */
  nextPageText: PropTypes.string,
  /** Internationalized label for the word 'Previous page' */
  prevPageText: PropTypes.string,
  /** Callback when the page is changed */
  onPage: PropTypes.func.isRequired,
  /** total number of items */
  totalItems: PropTypes.number,
  /** Internationalized label for the word 'Items' */
  totalItemsText: PropTypes.string,
  /** Id that can be used for testing */
  testID: PropTypes.string,
};

const SimplePaginationDefaultProps = {
  pageOfPagesText: (page, maxPage) => `Page ${page} of ${maxPage}`,
  pageText: null,
  nextPageText: 'Next page',
  prevPageText: 'Prev page',
  totalItemsText: 'Items',
  totalItems: undefined,
  testID: `${iotPrefix}-simple-pagination`,
};

/** This is a lighter weight pagination component than the default Carbon one */
const SimplePagination = ({
  pageText,
  prevPageText,
  nextPageText,
  pageOfPagesText,
  totalItemsText,
  totalItems,
  page,
  maxPage,
  onPage,
  testID,
}) => {
  const hasPrev = page > 1;
  const hasNext = page <= maxPage - 1;

  const handleNext = () => onPage(page + 1);
  const handlePrev = () => onPage(page - 1);

  return (
    <div className={`${iotPrefix}-simple-pagination-container`} data-testid={testID}>
      {totalItems ? (
        <span className={`${iotPrefix}-simple-pagination-page-label`} maxpage={maxPage}>
          {`${totalItems} ${totalItemsText}`}
        </span>
      ) : null}
      <div className={`${iotPrefix}-simple-pagination-page-bar`}>
        <span className={`${iotPrefix}-simple-pagination-page-label`} maxpage={maxPage}>
          {pageText ? `${pageText} ${page}` : pageOfPagesText(page, maxPage)}
        </span>
        {maxPage > 1 ? (
          <>
            <div
              className={
                hasPrev
                  ? `${prefix}--pagination__button ${prefix}--pagination__button--backward ${iotPrefix}-addons-simple-pagination-button`
                  : `${prefix}--pagination__button ${prefix}--pagination__button--backward ${iotPrefix}-addons-simple-pagination-button-disabled`
              }
              role="button"
              tabIndex={hasPrev ? 0 : -1}
              onClick={hasPrev ? handlePrev : undefined}
              onKeyDown={hasPrev ? (evt) => handleEnterKeyDown(evt, handlePrev) : undefined}
            >
              <CaretLeft16
                dir="ltr"
                description={prevPageText}
                className={
                  hasPrev
                    ? `${iotPrefix}-simple-pagination-caret`
                    : `${iotPrefix}-simple-pagination-caret-disabled`
                }
              />
            </div>
            <div
              className={
                hasNext
                  ? `${prefix}--pagination__button ${prefix}--pagination__button--forward ${iotPrefix}-addons-simple-pagination-button`
                  : `${prefix}--pagination__button ${prefix}--pagination__button--forward ${iotPrefix}-addons-simple-pagination-button-disabled`
              }
              role="button"
              tabIndex={hasNext ? 0 : -1}
              onClick={hasNext ? handleNext : undefined}
              onKeyDown={hasNext ? (evt) => handleEnterKeyDown(evt, handleNext) : undefined}
            >
              <CaretRight16
                dir="ltr"
                description={nextPageText}
                className={
                  hasNext
                    ? `${iotPrefix}-simple-pagination-caret`
                    : `${iotPrefix}-simple-pagination-caret-disabled`
                }
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

SimplePagination.propTypes = SimplePaginationPropTypes;
SimplePagination.defaultProps = SimplePaginationDefaultProps;

export default SimplePagination;
