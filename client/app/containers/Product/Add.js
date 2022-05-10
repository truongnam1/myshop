/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddProduct from '../../components/Manager/AddProduct';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBrandsSelect();
  }

  render() {
    const {
      history,
      user,
      productFormData,
      formErrors,
      brands,
      productChange,
      addProduct,
      setFormErrors
    } = this.props;

    return (
      <SubPage
        title='Add Product'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <AddProduct
          user={user}
          productFormData={productFormData}
          formErrors={formErrors}
          brands={brands}
          productChange={productChange}
          addProduct={addProduct}
          setFormErrors={setFormErrors}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    productFormData: state.product.productFormData,
    formErrors: state.product.formErrors,
    brands: state.brand.brandsSelect,
    // setFormErrors: state.product.setFormErrors,
  };
};

export default connect(mapStateToProps, actions)(Add);
