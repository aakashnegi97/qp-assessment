const connection = require("./db.ts");

exports.placeOrder = (groceryId, quantity, address, userId) => {
  let query =
    `insert into ` +
    "`order`" +
    ` (grocery_id, quantity, address, created_at,user_id) values (?,?,?,?,?)`;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [groceryId, quantity, address, new Date(), userId],
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
};

exports.placeCartOrder = (cart, address, userId) => {
  return Promise.all(
    (cart || [])?.map((groceryOrder) =>
      exports.placeOrder(
        groceryOrder?.id,
        groceryOrder?.quantity,
        address,
        userId
      )
    )
  );
};

exports.getMyOrder = ({ userId, limit, page }) => {
  if (!(page >= 0)) {
    page = 0;
  }
  if (!(limit >= 1)) {
    limit = 10;
  }
  let query = `select * from ` + "`order`" + ` where user_id=${userId}`;

  return new Promise((resolve, reject) => {
    connection.query(
      `${query} limit ${limit} offset ${page * limit}`,
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        let response = {
          data: result,
          totalCount: 0,
        };
        let countQuery = `select count(*) as totalCount from (${query}) t`;
        connection.query(countQuery, (err, result) => {
          if (err) {
            reject(err);
          }
          response.totalCount = result?.[0]?.totalCount || 0;
          resolve(response);
        });
      }
    );
  });
};

exports.getOrder = ({ id, limit, page }) => {
  if (!(page >= 0)) {
    page = 0;
  }
  if (!(limit >= 1)) {
    limit = 10;
  }
  let query = `select * from ` + "`order`";
  if (id) {
    query += ` where id=${id}`;
  }

  return new Promise((resolve, reject) => {
    connection.query(
      `${query} limit ${limit} offset ${page * limit}`,
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        let response = {
          data: result,
          totalCount: 0,
        };
        let countQuery = `select count(*) as totalCount from (${query}) t`;
        connection.query(countQuery, (err, result) => {
          if (err) {
            reject(err);
          }
          response.totalCount = result?.[0]?.totalCount || 0;
          resolve(response);
        });
      }
    );
  });
};

exports.updateOrder = ({ status, id }) => {
  let query = "update `order` set ";
  let setValue = "";

  if (status) {
    if (setValue) {
      setValue += ",";
    }
    setValue += ` status=?`;
  }

  return new Promise((resolve, reject) => {
    if (!setValue) {
      reject("Nothing to update!");
      return;
    }
    setValue += `, delivered_at=?`;
    query += setValue;
    query += ` where id=${id}`;
    connection.query(query, [status, new Date()], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};
