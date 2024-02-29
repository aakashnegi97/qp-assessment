const connection = require("./db.ts");

exports.getGroceries = (
  { search, category, limit, page, id },
  projectFields
) => {
  if (!(page >= 0)) {
    page = 0;
  }
  if (!(limit >= 1)) {
    limit = 10;
  }
  let query = `select * from grocery`;
  if (projectFields?.length) {
    query = `select `;
    projectFields?.forEach((field, index) => {
      if (index) {
        query += ", ";
      }
      query += field;
    });
    query += " from grocery";
  }
  let condition = "";
  if (search) {
    condition += ` (name like "%${search}%" or category like "%${search}%" or tags like "%${search}%")`;
  }
  if (category) {
    if (condition) {
      condition += " and ";
    }
    condition += ` category = "${category}"`;
  }
  if (id) {
    if (condition) {
      condition += " and ";
    }
    condition += ` id = ${id}`;
  }
  if (condition) {
    query += ` where ${condition}`;
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

exports.addGrocery = ({ name, price, category, tags, available_quantity }) => {
  let query = `insert into grocery (name, price, category, tags, available_quantity, created_at,updated_at) VALUES (?,?,?,?,?,?,?)`;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [name, price, category, tags, available_quantity, new Date(), new Date()],
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

exports.updateGrocery = ({
  name,
  price,
  category,
  tags,
  available_quantity,
  id,
}) => {
  let query = `update grocery set `;
  let setValue = "";
  if (name) {
    setValue += ` name="${name}"`;
  }
  if (price >= 0) {
    if (setValue) {
      setValue += ",";
    }
    setValue += ` price=${price}`;
  }
  if (category) {
    if (setValue) {
      setValue += ",";
    }
    setValue += ` category="${category}"`;
  }
  if (tags) {
    if (setValue) {
      setValue += ",";
    }
    setValue += ` tags="${tags}"`;
  }
  if (available_quantity >= 0) {
    if (setValue) {
      setValue += ",";
    }
    setValue += ` available_quantity=${available_quantity}`;
  }
  query += setValue;
  query += ` where id=${id}`;

  return new Promise((resolve, reject) => {
    if (!setValue) {
      reject("Nothing to update!");
      return;
    }
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

exports.deleteGrocery = (id) => {
  let query = `delete from grocery where id=${id}`;
  let setValue = "";

  return new Promise((resolve, reject) => {
    if (!id) {
      reject("Invalid Id!");
      return;
    }
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

exports.validateOrder = (orders) => {
  return Promise.all(
    (orders || [])?.map(
      (order) =>
        new Promise((resolve, reject) => {
          let query = `select * from grocery where id=${order.id}`;
          connection.query(query, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            if (!result?.length) {
              reject(`Invalid grocery id: ${order.id}`);
              return;
            }
            if (!(result?.[0]?.available_quantity >= order?.quantity)) {
              reject(`Insufficient stock of grocery id: ${order.id}`);
              return;
            }
            resolve(result);
          });
        })
    )
  );
};

exports.updateCartGroceries = (orders) => {
  return Promise.all(
    (orders || [])?.map(
      (order) =>
        new Promise((resolve, reject) => {
          let query = `select * from grocery where id=${order.id}`;
          connection.query(query, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            if (!result?.length) {
              reject(`Invalid grocery id: ${order.id}`);
              return;
            }
            if (!(result?.[0]?.available_quantity >= order?.quantity)) {
              reject(`Insufficient stock of grocery id: ${order.id}`);
              return;
            }
            query = `update grocery set available_quantity=${
              result?.[0]?.available_quantity - order?.quantity
            } where id=${order.id}`;
            connection.query(query, (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }
              resolve(result);
            });
          });
        })
    )
  );
};
