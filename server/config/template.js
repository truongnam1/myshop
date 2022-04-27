exports.resetEmail = (host, resetToken) => {
    const message = {
        subject: 'Reset Password',
        text: `${
        'Bạn nhận được thông báo này vì bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n\n' +
        'Vui lòng nhấp vào liên kết sau hoặc dán liên kết này vào trình duyệt của bạn để hoàn tất quá trình:\n\n' +
        'http://'
      }<a href="${host}/reset-password/${resetToken}">${host}/reset-password/${resetToken}</a> \n\n` +
            `Nếu bạn không yêu cầu, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n`
    };

    return message;
};

exports.confirmResetPasswordEmail = () => {
    const message = {
        subject: 'Password Changed',
        text: `Bạn nhận được email này vì bạn đã thay đổi mật khẩu của mình. \n\n` +
            `Nếu bạn không yêu cầu thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.`
    };

    return message;
};

exports.merchantSignup = (host, { resetToken, email }) => {
    const message = {
        subject: 'Merchant Registration',
        text: `${
      'Xin chúc mừng! Đơn của bạn đã được chấp nhận. Vui lòng hoàn tất đăng ký tài khoản Người bán của bạn bằng cách nhấp vào liên kết bên dưới. \n \n '+
      'Vui lòng nhấp vào liên kết sau hoặc dán liên kết này vào trình duyệt của bạn để hoàn tất quá trình:\n\n' +
      'http://'
    } <a href="${host}/merchant-signup/${resetToken}?email=${email}">${host}/merchant-signup/${resetToken}?email=${email}</a> \n\n`
    };

    return message;
};

exports.merchantWelcome = name => {
    const message = {
        subject: 'Merchant Registration',
        text: `Hi ${name}! Congratulations! Đơn đăng ký tài khoản người bán của bạn đã được chấp nhận. \n\n` +
            `Có vẻ như bạn đã có một tài khoản thành viên với chúng tôi. Vui lòng đăng nhập bằng thông tin đăng nhập thành viên của bạn và bạn sẽ có thể xem tài khoản người bán của mình.`
    };

    return message;
};

exports.signupEmail = name => {
    const message = {
        subject: 'Account Registration',
        text: `Hi ${name.firstName} ${name.lastName}! Cảm ơn bạn đã tạo một tài khoản và đồng hành cùng chúng tôi!.`
    };

    return message;
};

exports.newsletterSubscriptionEmail = () => {
    const message = {
        subject: 'Newsletter Subscription',
        text: `Bạn nhận được email này vì bạn đã đăng ký nhận bản tin của chúng tôi. \n\n` +
            `Nếu bạn không yêu cầu điều này, vui lòng liên hệ với chúng tôi ngay lập tức.`
    };

    return message;
};

exports.contactEmail = () => {
    const message = {
        subject: 'Contact Us',
        text: `Chúng tôi đã nhận được tin nhắn của bạn! Nhóm của chúng tôi sẽ liên hệ với bạn sớm. \n\n`
    };

    return message;
};

exports.merchantApplicationEmail = () => {
    const message = {
        subject: 'Bán hàng trong MERN Store',
        text: `Chúng tôi đã nhận được yêu cầu của bạn! Nhóm của chúng tôi sẽ liên hệ với bạn sớm. \n\n`
    };

    return message;
};

exports.orderConfirmationEmail = order => {
    const message = {
        subject: `Xác nhận đơn hàng ${order._id}`,
        text: `Hi ${order.user.profile.firstName}! Cảm ơn bạn đã đặt hàng!. \n\n` +
            `Chúng tôi đã nhận được đơn đặt hàng của bạn và sẽ liên hệ với bạn ngay sau khi gói hàng của bạn được chuyển đi. \n\n`
    };

    return message;
};