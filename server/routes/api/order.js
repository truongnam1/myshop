const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose');
const moment = require('moment');
// Bring in Models & Helpers
const Order = require('../../models/order');
const Merchant = require('../../models/merchant');
const User = require('../../models/user');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const mailgun = require('../../services/mailgun');
const mailtrap = require('../../services/mailtrap');

const store = require('../../helpers/store');

const OrderService = require('../../services/order/index');

router.post('/add', auth, async (req, res) => {
  try {
    const cart = req.body.cartId;
    const totals = req.body.totals;
    const user = req.user._id;
    const shops = req.body.shops;

    const orders = shops.map(shop => {
      return { cart, user, total: totals[shop], shop };
    });

    // const order = new Order({
    //   cart,
    //   user,
    //   total
    // });

    const orderDoc = await Order.insertMany(orders);
    mailtrap.sendEmail(req.user.email, 'order-confirmation', null, {
      _id: orderDoc[0]._doc._id,
      firstName: req.user.firstName
    });
    res.status(200).json({
      success: true,
      message: `Your order has been placed successfully!`,
      order: { _id: orderDoc[0]._doc._id }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// search orders api
router.get('/search', auth, async (req, res) => {
  try {
    const { search } = req.query;

    if (!Mongoose.Types.ObjectId.isValid(search)) {
      return res.status(200).json({
        orders: []
      });
    }

    let ordersDoc = null;

    if (req.user.role === role.ROLES.Admin) {
      ordersDoc = await Order.find({
        _id: Mongoose.Types.ObjectId(search)
      }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    } else {
      const user = req.user._id;
      ordersDoc = await Order.find({
        _id: Mongoose.Types.ObjectId(search),
        user
      }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    }

    ordersDoc = ordersDoc.filter(order => order.cart);

    if (ordersDoc.length > 0) {
      const newOrders = ordersDoc.map(o => {
        return {
          _id: o._id,
          total: parseFloat(Number(o.total.toFixed(2))),
          created: o.created,
          products: o.cart?.products
        };
      });

      let orders = newOrders.map(o => store.caculateTaxAmount(o));
      orders.sort((a, b) => b.created - a.created);
      res.status(200).json({
        orders
      });
    } else {
      res.status(200).json({
        orders: []
      });
    }
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch orders api
router.get('/', auth, async (req, res) => {
  try {
    const user = req.user._id;

    const isUser = req.query.isUser;
    const status = req.query.status;

    let ordersDoc;

    if (!isUser) {
      ordersDoc = await Order.find({
        shop: user,
        isSuccess: status || false
      }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    } else {
      ordersDoc = await Order.find({
        user,
        isSuccess: status || false
      }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });

      ordersDoc = ordersDoc.filter(
        (value, index, self) =>
          index === self.findIndex(t => t.cart._id === value.cart._id)
      );
    }

    ordersDoc = ordersDoc.filter(order => order.cart);

    if (ordersDoc.length > 0) {
      const newOrders = ordersDoc.map(o => {
        return {
          _id: o._id,
          total: parseFloat(Number(o.total.toFixed(2))),
          created: o.created,
          products: o.cart?.products,
          userId: o.user
        };
      });

      let orders = newOrders.map(o => store.caculateTaxAmount(o));
      orders.sort((a, b) => b.created - a.created);
      res.status(200).json({
        orders
      });
    } else {
      res.status(200).json({
        orders: []
      });
    }
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch order api
router.get('/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    let orderDoc = null;

    if (
      req.user.role === role.ROLES.Admin ||
      req.user.role === role.ROLES.Merchant
    ) {
      orderDoc = await Order.findOne({ _id: orderId }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    } else {
      const user = req.user._id;
      orderDoc = await Order.findOne({ _id: orderId, user }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    }

    if (!orderDoc || !orderDoc.cart) {
      return res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    let order = {
      _id: orderDoc._id,
      total: orderDoc.total,
      created: orderDoc.created,
      totalTax: 0,
      products: orderDoc?.cart?.products,
      cartId: orderDoc.cart._id,
      user: orderDoc.user
    };

    order = store.caculateTaxAmount(order);

    res.status(200).json({
      order
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete('/cancel/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId });
    const foundCart = await Cart.findOne({ _id: order.cart });

    increaseQuantity(foundCart.products);

    await Order.deleteOne({ _id: orderId });
    await Cart.deleteOne({ _id: order.cart });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/status/item/:itemId', auth, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const orderId = req.body.orderId;
    const cartId = req.body.cartId;
    const status = req.body.status || 'Cancelled';

    const foundCart = await Cart.findOne({ 'products._id': itemId });
    const foundCartProduct = foundCart.products.find(p => p._id == itemId);

    await Cart.updateOne(
      { 'products._id': itemId },
      {
        'products.$.status': status
      }
    );

    const cart = await Cart.findOne({ _id: cartId });
    const itemsSuccess = cart.products.filter(
      item => item.status == 'Processing'
    );

    await Order.updateOne(
      { _id: orderId },
      { isSuccess: itemsSuccess.length === cart.products.length ? true : false }
    );

    if (status === 'Cancelled') {
      await Product.updateOne(
        { _id: foundCartProduct.product },
        { $inc: { quantity: foundCartProduct.quantity } }
      );

      const cart = await Cart.findOne({ _id: cartId });
      const items = cart.products.filter(item => item.status === 'Cancelled');
      const itemsSuccess = cart.products.filter(
        item => item.status == 'Processing'
      );

      if (itemsSuccess.length === cart.products.length) {
        await Order.updateOne({ _id: orderId }, { isSuccess: true });
      }

      // All items are cancelled => Cancel order
      if (cart.products.length === items.length) {
        await Order.deleteOne({ _id: orderId });
        await Cart.deleteOne({ _id: cartId });

        return res.status(200).json({
          success: true,
          orderCancelled: true,
          message: `${
            req.user.role === role.ROLES.Admin ? 'Order' : 'Your order'
          } has been cancelled successfully`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item has been cancelled successfully!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item status has been updated successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/statistical/test', auth, async (req, res) => {
  const status = req.query?.status;
  const user = req.user;

  let orders;
  let statisticalAdmin = {
    totalMerchant: 0,
    totalAccount: 0,
    totalProduct: 0,
    totalUserWeek: []
  };

  if (user.role === 'ROLE_MERCHANT') {
    orders = await Order.find({ shop: user._id }).populate({
      path: 'cart',
      populate: {
        path: 'products.product'
      }
    });
  } else {
    orders = await Order.find().populate({
      path: 'cart',
      populate: {
        path: 'products.product'
      }
    });

    const [merchant, user, product] = await Promise.all([
      Merchant.count(),
      User.count(),
      Product.count()
    ]);
    const totalUserWeek = await OrderService.totalUserWeek();

    statisticalAdmin.totalMerchant = merchant;
    statisticalAdmin.totalAccount = user;
    statisticalAdmin.totalProduct = product;
    statisticalAdmin.totalUserWeek = totalUserWeek;
  }

  let findByMonth = [];
  if (status == 1) {
    findByMonth = orders.filter(
      order =>
        moment(order._doc.created).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD')
    );
  } else if (status == 2) {
    findByMonth = orders.filter(
      order => moment(order._doc.created).month() === new Date().getMonth()
    );
  } else {
    findByMonth = orders.filter(
      order => moment(order._doc.created).year() === new Date().getFullYear()
    );
  }
  var findByMonthTest;
  if (user.role === 'ROLE_MERCHANT') {
    findByMonthTest = OrderService.getOrderMerchant({ orders, status });
  } else if (user.role === 'ROLE_ADMIN') {
    findByMonthTest = OrderService.getOrderAdmin({ status });
  }

  let result = {
    // totalOrder: findByMonth.length,
    totalMoney: 0,
    totalOrder: findByMonthTest.length,
    totalOrderNotProcess: 0,
    totalProductProcessing: 0,
    totalProductShipped: 0,
    totalProductNotProcessing: 0,
    totalProductDelivered: 0,
    totalProductCancelled: 0
  };

  if (!(user.role === 'ROLE_MERCHANT')) {
    result = { ...result, ...statisticalAdmin };
  }

  findByMonth.forEach(item => {
    result.totalMoney = result.totalMoney + item._doc.total;

    if (!item.isSuccess)
      result.totalOrderNotProcess = result.totalOrderNotProcess + 1;
    item._doc.cart.products.forEach(product => {
      if (product.status == 'Processing')
        result.totalProductProcessing = result.totalProductProcessing + 1;
      else if (product.status == 'Shipped')
        result.totalProductShipped = result.totalProductShipped + 1;
      else if (product.status == 'Not processed')
        result.totalProductNotProcessing = result.totalProductNotProcessing + 1;
      else if (product.status == 'Delivered')
        result.totalProductDelivered = result.totalProductDelivered + 1;
      else result.totalProductCancelled = result.totalProductCancelled + 1;
    });
  });

  return res.json(result);
});

const increaseQuantity = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: item.quantity } }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};

module.exports = router;
