import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

/**
 * Pagination component will take a list of children,
 * each child is what will be displayed per page
 *
 */
export default class Paginator extends Component {
  constructor(props) {
    super(props);

    this.Paginator = React.createRef();

    this.state = {
      pageSelected: 1,
      numberOfColumns: '',
      numberOfPages: 0,
      scrollThresholds: null
    };

    this.renderPageButtons = this.renderPageButtons.bind(this);
    this.clickPageButton = this.clickPageButton.bind(this);
    this.calibrateDimensions = this.calibrateDimensions.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
    this.setItemInView = this.setItemInView.bind(this);
    this.setItemFlush = this.setItemFlush.bind(this);
  }

  componentDidMount() {
    return this.calibrateDimensions(() => {
      // todo: move to resizeObserver so it can automatically change
      // this is also a hack, waiting for styles to load
      // petabox css is extremely heavy, takes a smidge of time to deliver
      setTimeout(this.calibrateDimensions, 700);
    });
  }

  componentDidUpdate({ itemInViewClass: prevItemInViewClass }) {
    const { itemInViewClass } = this.props;
    if (prevItemInViewClass !== itemInViewClass) {
      this.setItemInView();
    } else {

    }
  }

  setItemFlush(scrollLeftValue) {
    this.Paginator.scrollLeft = scrollLeftValue;
  }

  setItemInView() {
    const { itemInViewClass } = this.props;
    const { scrollThresholds, pageSelected } = this.state;
    const item = document.querySelector(itemInViewClass);
    const paginator = this.Paginator.current;
    if (item) {
      if (item.offsetLeft === paginator.offsetLeft) return;

      const pages = Object.keys(scrollThresholds);
      let thisPage = null;
      let thisRange = null;

      // find range it is in,
      pages.forEach((page) => {
        const { low, high } = scrollThresholds[page];
        const numberToFind = item.offsetWidth + item.offsetLeft;
        const isInRange = (numberToFind >= low) && (numberToFind <= high);
        if (isInRange) {
          thisPage = parseInt(page, 10) || 1;
          thisRange = scrollThresholds[page];
        }
      });

      if (thisPage && thisRange) {
        // scroll to range
        const scrollLeftValue = ((thisPage === pages.length) ? thisRange.high : thisRange.low) || 0;

        if (paginator.scrollLeft !== scrollLeftValue) {
          console.log('CONFIRMED setItemInView', scrollLeftValue);
          paginator.scrollLeft = scrollLeftValue;
        }
        // set pageNumber
        if (thisPage !== pageSelected) {
          this.setState({ pageSelected: thisPage }, function confirmScrollTo(scrollLeftValue) {
            if (this && this.Paginator) {
              const paginator = this.Paginator.current;
              if (paginator.scrollLeft !== scrollLeftValue) {
                paginator.scrollTo(scrollLeftValue, 0);
                debugger;
              }
            }
          }.bind(this, scrollLeftValue));
        }
      }
    }
  }

  calibrateDimensions(stateCB = null) {
    const calculateDimensions = (element) => {
      const {
        scrollLeft, scrollWidth, clientWidth, offsetWidth, firstElementChild
      } = element;

      const numberOfColumns = Math.ceil(
        scrollWidth / firstElementChild.clientWidth
      );
      const compStyles = window.getComputedStyle(element);
      const numberOfPages = Math.ceil(scrollWidth / clientWidth);

      const scrollThresholds = {};

      for (let i = 0; i < numberOfPages; i++) {
        const page = i + 1;
        const lastLowThreshold = scrollThresholds[page - 1] && scrollThresholds[page - 1].high + 1;
        scrollThresholds[page] = {
          low: lastLowThreshold || clientWidth * (page - 1),
          high: clientWidth * page
        };
      }

      return {
        numberOfColumns,
        scrollLeft,
        scrollWidth,
        clientWidth,
        compStyles,
        offsetWidth,
        numberOfPages,
        scrollThresholds
      };
    };

    if (this.Paginator.current) {
      const {
        numberOfColumns, numberOfPages, scrollThresholds
      } = calculateDimensions(this.Paginator.current);

      const newState = {
        numberOfColumns,
        numberOfPages,
        scrollThresholds
      };

      this.setState(newState, stateCB);
    }
  }

  clickPageButton(event) {
    const { scrollThresholds } = this.state;
    const pageSelected = parseInt(event.target.getAttribute('data-page-number'), 10);
    const { low: leftAlignThreshold } = scrollThresholds[pageSelected];
    this.Paginator.current.scrollTo({
      top: 0,
      left: leftAlignThreshold,
      behavior: 'smooth'
    });

    this.setState({ pageSelected });
  }

  goToNextPage(event) {
    const { pageSelected, scrollThresholds } = this.state;
    const nextPage = pageSelected + 1;
    const nextPageThreshold = scrollThresholds[nextPage];
    this.Paginator.current.scrollTo({
      top: 0,
      left: nextPageThreshold.low,
      behavior: 'smooth'
    });

    this.setState({ pageSelected: nextPage });
  }

  goToPreviousPage(event) {
    const { pageSelected, scrollThresholds } = this.state;
    const prevPage = pageSelected - 1 || 1;
    const prevPageThreshold = scrollThresholds[prevPage];

    this.Paginator.current.scrollTo({
      top: 0,
      left: prevPageThreshold.low,
      behavior: 'smooth'
    });
    this.setState({ pageSelected: prevPage });
  }

  createRightButton() {
    const { pageSelected, numberOfPages } = this.state;

    if (numberOfPages === pageSelected) return null;

    return (
      <button type="button" className="pagination-arrow right" onClick={this.goToNextPage}>
        <span className="sr-only">next page</span>
      </button>
    );
  }

  createLeftButton() {
    const { pageSelected } = this.state;

    if (pageSelected === 1) return null;

    return (
      <button type="button" className="pagination-arrow left" onClick={this.goToPreviousPage}>
        <span className="sr-only">previous page</span>
      </button>
    );
  }

  renderPageButtons() {
    const { numberOfPages, scrollThresholds, pageSelected } = this.state;
    if (!numberOfPages || numberOfPages < 2) return null;

    const pageNumbers = Object.keys(scrollThresholds);
    const hasExpectedNumberOfPages = numberOfPages === pageNumbers.length;

    if (hasExpectedNumberOfPages) {
      const pageButtons = pageNumbers.map((thisPage) => {
        const isPage = parseInt(thisPage, 10) === pageSelected;
        return (
          <button
            type="button"
            onClick={this.clickPageButton}
            data-page-number={thisPage}
            className={`pagination-button ${isPage ? 'selected' : ''}`}
          >
            <span className="sr-only">{thisPage}</span>
          </button>
        );
      });

      return <div className="page-buttons">{ pageButtons }</div>;
    }
  }

  render() {
    const { children } = this.props;
    const { numberOfColumns } = this.state;
    const paginatorClass = numberOfColumns > 1 ? 'half' : '';

    return (
      <Fragment>
        <div
          ref={this.Paginator}
          className={`flex-pagination ${paginatorClass}`}
          onTouchStart={this.onSwipeStart}
          onTouchEnd={this.onSwipeEnd}
          onWheel={this.onSwipeScrollHandler}
        >
          { children }
        </div>
        { this.createLeftButton() }
        { this.createRightButton() }
        { this.renderPageButtons() }
      </Fragment>
    );
  }
}

Paginator.defaultProps = {
  children: null
};

Paginator.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object, // React object
    PropTypes.arrayOf(PropTypes.object) // More than one React objects
  ])
};
