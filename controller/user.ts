const groceryModel = require("../model/groceries.ts");
const orderModel = require("../model/order.ts");

exports.getGroceries = (req, res) => {
  let reqBody = {
    id: req?.query?.id ? parseInt(req?.query?.id) : null,
    category: req?.query?.category || "",
    search: req?.query?.search || "",
    limit: req?.query?.limit || 10,
    page: 0,
  };
  if (Number(req?.query?.page) > 0) {
    reqBody.page = Number(req?.query?.page);
  }

  let response = {
    status: true,
    data: null,
    errorMessage: "",
    successMessage: "",
  };

  let statusCode = 200;

  groceryModel
    .getGroceries(reqBody, ["id", "name", "price", "category"])
    .catch((err) => {
      statusCode = 500;
      response.status = false;
      response.errorMessage = err?.sqlMessage || "Error!";
    })
    .then((result) => {
      if (response.status) {
        response.data = result;
        response.successMessage = "Success!";
      }
    })
    .catch((err) => {
      statusCode = err.statusCode;
      response.status = false;
      response.errorMessage = err?.message;
    })
    .finally(() => {
      res.status(statusCode).json(response);
    });
};

exports.placeOrder = (req, res) => {
  // Planning to create seperate order for each item.

  let user = req?.user;

  let reqBody = {
    address: req?.body?.address || "",
    cart: req?.body?.cart || [],
  };

  let response = {
    status: true,
    data: null,
    errorMessage: "",
    successMessage: "",
  };

  let statusCode = 200;

  if (!reqBody?.cart?.length) {
    statusCode = 400;
    response.status = false;
    response.errorMessage = "Cart is empty!";
    res.status(statusCode).json(response);
    return;
  }

  let groceryItem = {};

  reqBody?.cart?.forEach((item) => {
    if (groceryItem[item?.id]) {
      groceryItem[item?.id] += item?.quantity || 0;
    } else {
      groceryItem[item?.id] = item?.quantity || 0;
    }
  });
  reqBody.cart = [];
  Object.keys(groceryItem)?.forEach((groceryId) => {
    reqBody.cart.push({
      id: parseInt(groceryId),
      quantity: groceryItem[groceryId],
    });
  });

  groceryModel
    .validateOrder(reqBody?.cart || [])
    .catch((err) => {
      statusCode = 500;
      response.status = false;
      response.errorMessage = err?.sqlMessage || err || "Error!";
    })
    .then(() => {
      if (response.status) {
        return orderModel
          .placeCartOrder(reqBody.cart, reqBody.address, user?.id)
          .catch((err) => {
            statusCode = 500;
            response.status = false;
            response.errorMessage = err?.sqlMessage || err || "Error!";
          });
      }
    })
    .then(() => {
      if (response.status) {
        response.successMessage = "Successfull!";
        return groceryModel.updateCartGroceries(reqBody.cart).catch((err) => {
          statusCode = 500;
          response.status = false;
          response.errorMessage = err?.sqlMessage || err || "Error!";
        });
      }
    })
    .catch((err) => {
      statusCode = err.statusCode;
      response.status = false;
      response.errorMessage = err?.message;
    })
    .finally(() => {
      res.status(statusCode).json(response);
    });
};

exports.myOrder = (req, res) => {
  let user = req?.user;
  let reqBody = {
    userId: user?.id,
    limit: req?.query?.limit || 10,
    page: req?.query?.page || 0,
  };

  let response = {
    status: true,
    data: null,
    errorMessage: "",
    successMessage: "",
  };

  let statusCode = 200;

  orderModel
    .getMyOrder(reqBody)
    .catch((err) => {
      statusCode = 500;
      response.status = false;
      response.errorMessage = err?.sqlMessage || "Error!";
    })
    .then((result) => {
      if (response.status) {
        response.data = result;
        response.successMessage = "Success!";
      }
    })
    .catch((err) => {
      statusCode = err.statusCode;
      response.status = false;
      response.errorMessage = err?.message;
    })
    .finally(() => {
      res.status(statusCode).json(response);
    });
};
