import React, { useState, useEffect } from "react"
import ReactPagination from "react-paginate"
import Select, { SingleValue } from "react-select"
import { NumberOption } from "types/common"
import {
  DEFAULT_ITEMS_PER_PAGE,
  ITEMS_PER_PAGE_OPTIONS,
  PAGE_RANGE_DISPLAYED
} from "constants/pagination"
import "./style.scss"

const itemsPerPageOptions: NumberOption[] = ITEMS_PER_PAGE_OPTIONS.map(
  (option) => ({
    value: option,
    label: option
  })
)

interface PaginationPropsType {
  totalCount: number
  isReset: boolean
  onChangePage: (start: number, end: number) => void
}

const Pagination = ({
  totalCount,
  isReset,
  onChangePage
}: PaginationPropsType) => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    DEFAULT_ITEMS_PER_PAGE
  )
  const [currentPage, setCurrentPage] = useState<number>(0)

  const handleDataTablePageChange = (selectedItem: { selected: number }) => {
    const startOffset = selectedItem.selected * itemsPerPage
    let endOffset = (selectedItem.selected + 1) * itemsPerPage - 1
    if (endOffset >= totalCount) {
      endOffset = totalCount - 1
    }

    setCurrentPage(selectedItem.selected)
    onChangePage(startOffset, endOffset)
  }

  const resetPagination = () => {
    setCurrentPage(0)
    onChangePage(0, itemsPerPage - 1)
  }

  const handleChangeItemsPerPage = (
    selectedOption: SingleValue<NumberOption>
  ) => {
    if (selectedOption !== null) {
      setItemsPerPage(selectedOption.value)
    }
  }

  useEffect(() => {
    if (isReset) {
      resetPagination()
    }
  }, [isReset])

  useEffect(() => {
    resetPagination()
  }, [itemsPerPage])

  return (
    <div className="pagination-container">
      <ReactPagination
        nextLabel=">"
        previousLabel="<"
        onPageChange={handleDataTablePageChange}
        pageRangeDisplayed={PAGE_RANGE_DISPLAYED}
        pageCount={Math.ceil(totalCount / itemsPerPage)}
        forcePage={currentPage}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
      <div className="items-per-page">
        <span className="items-per-page-label">Show:</span>
        <Select
          options={itemsPerPageOptions}
          value={{ value: itemsPerPage, label: itemsPerPage }}
          onChange={handleChangeItemsPerPage}
        />
      </div>
    </div>
  )
}

export default Pagination
