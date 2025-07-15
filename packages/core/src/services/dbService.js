// packages/core/src/services/dbService.js
let dbProvider;

if (process.env.DB_PROVIDER === 'firebase') {
  // Leverage your existing firebase.js
  import('../../firebase').then(module => {
    dbProvider = module.default;  // Assume exports db
  });
} else if (process.env.DB_PROVIDER === 'aws') {
  // Scalable to PostgreSQL on RDS
  import('pg').then(({ Pool }) => {
    const pool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING });
    dbProvider = {
      query: async (text, params) => (await pool.query(text, params)).rows,
      // Add transaction support for complex CUJs
    };
  });
} else {
  throw new Error('Invalid DB_PROVIDER');
}

// Example Method: getDoc (extensible for any collection)
export const getDoc = async (collection, id) => {
  if (process.env.DB_PROVIDER === 'firebase') {
    const docRef = dbProvider.collection(collection).doc(id);
    const doc = await docRef.get();
    return doc.exists ? doc.data() : null;
  } else {
    const [result] = await dbProvider.query(`SELECT * FROM ${collection} WHERE id = $1`, [id]);
    return result || null;
  }
};

// Add more: setDoc, updateDoc, queryCollection - all abstracted for scalability
export const updateDoc = async (collection, id, data) => {
  if (process.env.DB_PROVIDER === 'firebase') {
    const docRef = dbProvider.collection(collection).doc(id);
    await docRef.update(data);
    return { id, ...data };
  } else {
    const setClause = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(data)];
    await dbProvider.query(`UPDATE ${collection} SET ${setClause} WHERE id = $1`, values);
    return { id, ...data };
  }
};

export const setDoc = async (collection, id, data) => {
  if (process.env.DB_PROVIDER === 'firebase') {
    const docRef = dbProvider.collection(collection).doc(id);
    await docRef.set(data);
    return { id, ...data };
  } else {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, index) => `$${index + 2}`).join(', ');
    const values = [id, ...Object.values(data)];
    await dbProvider.query(`INSERT INTO ${collection} (id, ${columns}) VALUES ($1, ${placeholders}) ON CONFLICT (id) DO UPDATE SET ${Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ')}`, values);
    return { id, ...data };
  }
};

export const queryCollection = async (collection, filters = {}) => {
  if (process.env.DB_PROVIDER === 'firebase') {
    let query = dbProvider.collection(collection);
    Object.entries(filters).forEach(([key, value]) => {
      query = query.where(key, '==', value);
    });
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    let whereClause = '';
    const values = [];
    if (Object.keys(filters).length > 0) {
      const conditions = Object.entries(filters).map(([key, value], index) => {
        values.push(value);
        return `${key} = $${index + 1}`;
      });
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }
    const results = await dbProvider.query(`SELECT * FROM ${collection} ${whereClause}`, values);
    return results;
  }
};

export const deleteDoc = async (collection, id) => {
  if (process.env.DB_PROVIDER === 'firebase') {
    const docRef = dbProvider.collection(collection).doc(id);
    await docRef.delete();
    return true;
  } else {
    await dbProvider.query(`DELETE FROM ${collection} WHERE id = $1`, [id]);
    return true;
  }
};

// Export for use in modules
export default dbProvider; 