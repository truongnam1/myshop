const User = require('../../models/user.js');
const Order = require('../../models/order.js');

const moment = require('moment');



async function totalUserWeek() {
    let dates = [];

    const a = new Date();
    console.log(`asdasdasd`);
    for (let i = 6; i >= 0; --i) {

        let yesterday = new Date(a.getTime());

        yesterday.setDate(a.getDate() - i);

        dates = [...dates, yesterday];

    }

    const totalUserWeek = await Promise.all(dates.map(async(date) => {
        return User.count({ created: { $lte: date } })
    }));

    const rs = dates.map((date, index) => {
        return {
            date: moment(date).format('YYYY-MM-DD'),
            count: totalUserWeek[index],
        }
    })

    console.log(`rs`, rs);
    return rs;
}

async function getOrderAdmin({ status }) {
    const orders = await Order.find().populate({
        path: 'cart',
        populate: {
            path: 'products.product'
        }
    });

    return filterOrder({ orders, status });

}

async function getOrderMerchant({ userId, status }) {
    const orders = await Order.find({ shop: userId }).populate({
        path: 'cart',
        populate: {
            path: 'products.product'
        }
    });
    return filterOrder({ orders, status });
}


function filterOrder({ orders, status }) {
    console.log(`status`, status);
    console.log(`orders`, orders);
    var findByMonth;
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
    return findByMonth;
}

module.exports = {
    totalUserWeek: totalUserWeek,
    getOrderAdmin: getOrderAdmin,
    getOrderMerchant: getOrderMerchant
}