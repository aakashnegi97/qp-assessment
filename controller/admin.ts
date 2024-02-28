const groceryModel = require("../model/groceries.ts");

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
