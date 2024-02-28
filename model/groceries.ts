const connection = require("./db.ts");

exports.getGroceries = ({ search, category, limit, page }) => {
  let query = `select * from grocery`;
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

exports.addGrocery = ({ name, price, category, tags }) => {
  let query = `insert into grocery (name, price, category, tags,created_at,updated_at) VALUES (?,?,?,?,?,?)`;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [name, price, category, tags, new Date(), new Date()],
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

exports.updateGrocery = ({ name, price, category, tags, id }) => {
  let query = `update grocery set `;
  let setValue = "";
  if (name) {
    setValue += ` name="${name}"`;
  }
  if (price) {
    if (setValue) {
      setValue += ",";
    }
    setValue += ` price="${price}"`;
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
  query += setValue;
  query += ` where id=${id}`;

  return new Promise((resolve, reject) => {
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
