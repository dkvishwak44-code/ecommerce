import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

async function main() {
  await mongoose.connect(MONGO_URI);

  const Role = mongoose.model("Role", new mongoose.Schema({
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
  }, { strict: false }));

  const Permission = mongoose.model("Permission", new mongoose.Schema({}, { strict: false }));

  const roles = await Role.find({}).populate('permissions');
  for (const r of roles) {
    console.log(`\n=== Role ID: ${r._id} | Name: ${r.name} | DisplayName: ${r.displayName} ===`);
    console.log(`Permissions count: ${r.permissions?.length || 0}`);
    if (r.permissions) {
      console.log(r.permissions.map(p => p.key).join(", "));
    }
  }

  await mongoose.disconnect();
}

main().catch(console.error);
