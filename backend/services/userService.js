import xlsx from "xlsx";
import pool from "../config/database.js";

export const processAndStoreUsers = async (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  if (data.length === 0) {
    throw new Error("Excel file is empty or has an invalid format.");
  }
  const validatedData = data.filter(
    (row) => row.Name && row.Email && row.ContactNumber
  );
  const emailsInFile = validatedData.map((user) => user.Email);
  const contactsInFile = validatedData.map((user) =>
    String(user.ContactNumber)
  );
  const existingUsersQuery = await pool.query(
    "SELECT email, contact_number FROM users WHERE email = ANY($1::text[]) OR contact_number = ANY($2::text[])",
    [emailsInFile, contactsInFile]
  );
  const existingEmailsInDB = new Set(
    existingUsersQuery.rows.map((u) => u.email)
  );
  const existingContactsInDB = new Set(
    existingUsersQuery.rows.map((u) => u.contact_number)
  );
  const duplicates = [];
  const usersToInsert = [];
  const seenInFileEmails = new Set();
  const seenInFileContacts = new Set();

  validatedData.forEach((user) => {
    const contactStr = String(user.ContactNumber);
    if (
      existingEmailsInDB.has(user.Email) ||
      existingContactsInDB.has(contactStr) ||
      seenInFileEmails.has(user.Email) ||
      seenInFileContacts.has(contactStr)
    ) {
      duplicates.push(user);
    } else {
      usersToInsert.push(user);
      seenInFileEmails.add(user.Email);
      seenInFileContacts.add(contactStr);
    }
  });

  if (usersToInsert.length > 0) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const user of usersToInsert) {
        const userInsertQuery =
          "INSERT INTO users (name, email, contact_number) VALUES ($1, $2, $3) RETURNING id";
        const userValues = [user.Name, user.Email, String(user.ContactNumber)];
        const res = await client.query(userInsertQuery, userValues);
        const userId = res.rows[0].id;
        const userDetailsInsertQuery =
          "INSERT INTO user_details (user_id, age, gender, location) VALUES ($1, $2, $3, $4)";
        const userDetailsValues = [
          userId,
          user.Age,
          user.Gender,
          user.Location,
        ];
        await client.query(userDetailsInsertQuery, userDetailsValues);
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  return { insertedCount: usersToInsert.length, duplicates };
};

export const fetchUsersWithFilters = async (filters) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 6;
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const queryParams = [];
  let paramIndex = 1;

  if (filters.name) {
    whereClause += ` AND u.name ILIKE $${paramIndex++}`;
    queryParams.push(`%${filters.name}%`);
  }
  if (filters.age) {
    whereClause += ` AND ud.age = $${paramIndex++}`;
    queryParams.push(filters.age);
  }
  if (filters.gender) {
    whereClause += ` AND ud.gender = $${paramIndex++}`;
    queryParams.push(filters.gender);
  }
  if (filters.location) {
    whereClause += ` AND ud.location ILIKE $${paramIndex++}`;
    queryParams.push(`%${filters.location}%`);
  }

  const sortOrder = filters.sortOrder === "DESC" ? "DESC" : "ASC";

  const sortByWhitelist = {
    name: "u.name",
    age: "ud.age",
    location: "ud.location",
    created_at: "u.created_at",
  };
  const sortBy = sortByWhitelist[filters.sortBy] || sortByWhitelist.created_at;
  const orderByClause = `ORDER BY ${sortBy} ${sortOrder}`;

  const countQuery = `
    SELECT COUNT(*) 
    FROM users u 
    JOIN user_details ud ON u.id = ud.user_id 
    ${whereClause}
  `;
  const countResult = await pool.query(countQuery, queryParams);
  const totalCount = parseInt(countResult.rows[0].count);

  const dataQuery = `
    SELECT u.id, u.name, u.email, u.contact_number, ud.age, ud.gender, ud.location 
    FROM users u 
    JOIN user_details ud ON u.id = ud.user_id 
    ${whereClause}
    ${orderByClause}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;

  const dataParams = [...queryParams, limit, offset];
  const { rows } = await pool.query(dataQuery, dataParams);

  return { users: rows, totalCount };
};

export const fetchAllUsersWithFilters = async (filters) => {
  let whereClause = "WHERE 1=1";
  const queryParams = [];
  let paramIndex = 1;

  if (filters.name) {
    whereClause += ` AND u.name ILIKE $${paramIndex++}`;
    queryParams.push(`%${filters.name}%`);
  }
  if (filters.age) {
    whereClause += ` AND ud.age = $${paramIndex++}`;
    queryParams.push(filters.age);
  }
  if (filters.gender) {
    whereClause += ` AND ud.gender = $${paramIndex++}`;
    queryParams.push(filters.gender);
  }
  if (filters.location) {
    whereClause += ` AND ud.location ILIKE $${paramIndex++}`;
    queryParams.push(`%${filters.location}%`);
  }

  const sortOrder = filters.sortOrder === "DESC" ? "DESC" : "ASC";
  const sortByWhitelist = {
    name: "u.name",
    age: "ud.age",
    location: "ud.location",
    created_at: "u.created_at",
  };
  const sortBy = sortByWhitelist[filters.sortBy] || sortByWhitelist.created_at;
  const orderByClause = `ORDER BY ${sortBy} ${sortOrder}`;

  const dataQuery = `
    SELECT u.name, u.email, u.contact_number, ud.age, ud.gender, ud.location 
    FROM users u 
    JOIN user_details ud ON u.id = ud.user_id 
    ${whereClause}
    ${orderByClause}
  `;

  const { rows } = await pool.query(dataQuery, queryParams);
  return rows;
};

export const updateUserInDB = async (id, userData) => {
  const { name, email, contact_number, gender, location } = userData;
  let ageValue = parseInt(userData.age, 10);
  if (isNaN(ageValue)) {
    ageValue = null;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userUpdateQuery = `
      UPDATE users 
      SET name = $1, email = $2, contact_number = $3 
      WHERE id = $4`;
    await client.query(userUpdateQuery, [name, email, contact_number, id]);
    const userDetailsUpdateQuery = `
      UPDATE user_details 
      SET age = $1, gender = $2, location = $3 
      WHERE user_id = $4`;
    await client.query(userDetailsUpdateQuery, [
      ageValue,
      gender,
      location,
      id,
    ]);

    await client.query("COMMIT");

    const updatedUserQuery = `
        SELECT u.id, u.name, u.email, u.contact_number, ud.age, ud.gender, ud.location
        FROM users u
        JOIN user_details ud ON u.id = ud.user_id
        WHERE u.id = $1
    `;
    const result = await client.query(updatedUserQuery, [id]);
    return result.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const deleteUserFromDB = async (id) => {
  const deleteQuery = "DELETE FROM users WHERE id = $1";
  await pool.query(deleteQuery, [id]);
};
