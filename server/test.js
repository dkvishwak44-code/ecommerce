//  const bcrypt = require('bcryptjs');
import bcrypt from "bcryptjs";
  (async () => {
    const hash = '$2a$12$o.inDf2IE5RY10MEf3twF.lK7HH6lbkDMS1jR6dLWww9gSLz3OX0C';
    const ok = await bcrypt.compare('admin@123', hash);
    console.log('match =>', ok);
  })()