const groceryModel = require("../model/groceries.ts");
const orderModel = require("../model/order.ts");

exports.getGroceries = (req, res) => {
  let reqBody = {
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
    .getGroceries(reqBody)
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

exports.addGrocery = (req, res) => {
  let reqBody = {
    name: req?.body?.name || "",
    price: req?.body?.price || 0,
    category: req?.body?.category || "",
    tags: req?.body?.tags || "",
    available_quantity: req?.body?.available_quantity || 0,
  };

  let response = {
    status: true,
    data: null,
    errorMessage: "",
    successMessage: "",
  };

  let statusCode = 200;

  groceryModel
    .addGrocery(reqBody)
    .catch((err) => {
      statusCode = 500;
      response.status = false;
      response.errorMessage = err?.sqlMessage || "Error!";
    })
    .then((result) => {
      if (response.status) {
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

exports.updateGrocery = (req, res) => {
  let id = parseInt(req.params.id);
  let update = {};
  update["id"] = id;
  if (req?.body?.name) {
    update["name"] = req?.body?.name || "";
  }
  if (req?.body?.price) {
    update["price"] = req?.body?.price || 0;
  }
  if (req?.body?.category) {
    update["category"] = req?.body?.category || "";
  }
  if (req?.body?.tags) {
    update["tags"] = req?.body?.tags || "";
  }
  if (req?.body?.available_quantity >= 0) {
    update["available_quantity"] = req?.body?.available_quantity;
  }

  let response = {
    status: true,
    data: null,
    errorMessage: "",
    successMessage: "",
  };

  let statusCode = 200;

  if (!id) {
    statusCode = 400;
    response.status = false;
    response.errorMessage = "Id not found!";
    return res.status(statusCode).json(response);
  }

  groceryModel
    .getGroceries({ id })
    .catch((err) => {
      statusCode = 500;
      response.status = false;
      response.errorMessage = err?.sqlMessage || "Error!";
    })
    .then((result) => {
      if (response.status && result?.totalCount != 1) {
        response.status = false;
        response.errorMessage = "Invalid grocery Id!";
      }
    })
    .then(() => {
      if (response.status) {
        return groceryModel.updateGrocery(update).catch((err) => {
          statusCode = 500;
          response.status = false;
          response.errorMessage = err?.sqlMessage || err || "Error!";
        });
      }
    })
    .then((result) => {
      if (response.status && result) {
        response.successMessage = "Successfull!";
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

exports.deleteGrocery = (req, res) => {
  let id = parseInt(req.params.id);

  let response = {
    status: true,
    data: null,
    errorMessage: "",
    successMessage: "",
  };

  let statusCode = 200;

  if (!id) {
    statusCode = 400;
    response.status = false;
    response.errorMessage = "Id not found!";
    return res.status(statusCode).json(response);
  }

  groceryModel
    .getGroceries({ id })
    .catch((err) => {
      statusCode = 500;
      response.status = false;
      response.errorMessage = err?.sqlMessage || "Error!";
    })
    .then((result) => {
      if (response.status && result?.totalCount != 1) {
        response.status = false;
        response.errorMessage = "Invalid grocery Id!";
      }
    })
    .then(() => {
      if (response.status) {
        return groceryModel.deleteGrocery(id).catch((err) => {
          statusCode = 500;
          response.status = false;
          response.errorMessage = err?.sqlMessage || err || "Error!";
        });
      }
    })
    .then((result) => {
      if (response.status && result) {
        response.successMessage = "Successfull!";
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

exports.updateOrder = (req, res) => {
  let id = parseInt(req.params.id);
  let update = {};
  update["id"] = id;
  if (req?.body?.status) {
    update["status"] = req?.body?.status || "";
  }

  let response = {
    status: true,
    data: null,
    errorMessage: "",
    successMessage: "",
  };

  let statusCode = 200;

  if (!id) {
    statusCode = 400;
    response.status = false;
    response.errorMessage = "Id not found!";
    return res.status(statusCode).json(response);
  }

  orderModel
    .getOrder({ id })
    .catch((err) => {
      statusCode = 500;
      response.status = false;
      response.errorMessage = err?.sqlMessage || "Error!";
    })
    .then((result) => {
      if (response.status && result?.totalCount != 1) {
        response.status = false;
        response.errorMessage = "Invalid order Id!";
      }
    })
    .then(() => {
      if (response.status) {
        return orderModel.updateOrder(update).catch((err) => {
          statusCode = 500;
          response.status = false;
          response.errorMessage = err?.sqlMessage || err || "Error!";
        });
      }
    })
    .then((result) => {
      if (response.status && result) {
        response.successMessage = "Successfull!";
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

exports.getOrders = (req, res) => {
  let reqBody = {
    id: parseInt(req?.query?.id || 0),
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

  orderModel
    .getOrder(reqBody)
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
