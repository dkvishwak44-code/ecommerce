import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

async function main() {
  await mongoose.connect(MONGO_URI);

  const User = mongoose.model("User", new mongoose.Schema({
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
  }, { strict: false }));

  const Role = mongoose.model("Role", new mongoose.Schema({
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
  }, { strict: false }));

  const Permission = mongoose.model("Permission", new mongoose.Schema({}, { strict: false }));

  const users = await User.find({}).populate({
    path: 'role',
    populate: {
      path: 'permissions'
    }
  });

  for (const u of users) {
    console.log(`\n=== User: ${u.email} (${u.name}) ===`);
    console.log(`Role Object ID: ${u.role?._id}`);
    console.log(`Role Name: ${u.role?.name}`);
    console.log(`Role DisplayName: ${u.role?.displayName}`);
    console.log(`Permissions (${u.role?.permissions?.length || 0}):`);
    if (u.role?.permissions) {
      console.log(u.role.permissions.map(p => p.key).join(", "));
    }
  }

  await mongoose.disconnect();
}

main().catch(console.error);
