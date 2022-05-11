import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';  

const PaginationComponent = (props) => {

  const {totalPage, changePage} = props;
  const renderPage = (totalPage) => {
    let page = [];
    for(let i=0;i<totalPage;++i) {
      page = [...page, htmlPage(i+1)];
    }
    return page;
  }

  const htmlPage = (index) => {
    return (
      <PaginationItem>
        <PaginationLink onClick={() => changePage({limit: 5, page: index})}>
          {index}
        </PaginationLink>
      </PaginationItem>
    )
  }
  return (
    <Pagination aria-label="Page navigation example">
      <PaginationItem>
        <PaginationLink previous href="#" />
      </PaginationItem>
      {renderPage(totalPage)}
      
      <PaginationItem>
        <PaginationLink next href="#" />
      </PaginationItem>
    </Pagination>
  );
}

export default PaginationComponent;