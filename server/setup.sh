mkdir -p src/{config,bootstrap,constants,middleware,utils,templates/{emails,pdf},uploads/{products,categories,users,stores,temp},public/{images,banners,brands,files},docs,sockets,queues,jobs,database/{migrations,seeders,indexes,backups},tests/{unit,integration,e2e,mocks},api/admin/v1,api/client/v1}

touch src/server.js
touch src/app.js
touch src/README.md

# =========================
# CONFIG
# =========================
touch src/config/{db.js,env.js,mail.js,redis.js,logger.js,cloudinary.js,multer.js,socket.js,swagger.js}

# =========================
# BOOTSTRAP
# =========================
touch src/bootstrap/{index.js,seedPermissions.js,seedRoles.js,createSuperAdmin.js,createDefaultStore.js}

# =========================
# CONSTANTS
# =========================
touch src/constants/{permissions.js,roles.js,status.js,messages.js,regex.js,orderStatus.js,pagination.js}

# =========================
# MIDDLEWARE
# =========================
touch src/middleware/{auth.middleware.js,customerAuth.middleware.js,permission.middleware.js,ownership.middleware.js,validate.middleware.js,upload.middleware.js,error.middleware.js,notFound.middleware.js,rateLimit.middleware.js,storeResolver.middleware.js,logger.middleware.js,audit.middleware.js}

# =========================
# UTILS
# =========================
touch src/utils/{jwt.js,hash.js,response.js,pagination.js,apiFeatures.js,slugify.js,generateOtp.js,generatePassword.js,sendEmail.js,uploadFile.js,date.js,validators.js,auditLogger.js,calculateTax.js,invoiceGenerator.js,cache.js,asyncHandler.js}

# =========================
# TEMPLATES
# =========================
touch src/templates/emails/{otp.template.js,resetPassword.template.js,storeCreated.template.js,welcome.template.js,orderPlaced.template.js,orderDelivered.template.js,invoice.template.js}

touch src/templates/pdf/{invoice.template.js,shippingLabel.template.js}

# =========================
# SOCKETS
# =========================
touch src/sockets/{index.js,order.socket.js,notification.socket.js,chat.socket.js}

# =========================
# QUEUES
# =========================
touch src/queues/{email.queue.js,sms.queue.js,notification.queue.js,order.queue.js}

# =========================
# JOBS
# =========================
touch src/jobs/{cleanOtp.job.js,expireOrders.job.js,analytics.job.js,clearLogs.job.js,abandonedCart.job.js}

# =========================
# DOCS
# =========================
touch src/docs/{swagger.js,openapi.json,postman_collection.json}

# =========================
# API ADMIN
# =========================
touch src/api/admin/routes.js

touch src/api/admin/v1/{auth.routes.js,user.routes.js,role.routes.js,permission.routes.js,store.routes.js,product.routes.js,category.routes.js,brand.routes.js,order.routes.js,customer.routes.js,review.routes.js,analytics.routes.js,dashboard.routes.js,notification.routes.js,audit.routes.js,coupon.routes.js,banner.routes.js,settings.routes.js}

# =========================
# API CLIENT
# =========================
touch src/api/client/routes.js

touch src/api/client/v1/{auth.routes.js,customer.routes.js,product.routes.js,category.routes.js,brand.routes.js,store.routes.js,cart.routes.js,wishlist.routes.js,checkout.routes.js,order.routes.js,review.routes.js,address.routes.js,coupon.routes.js,home.routes.js}

# =========================
# MODULES
# =========================

# AUTH
mkdir -p src/modules/auth
touch src/modules/auth/{auth.controller.js,auth.service.js,auth.repository.js,auth.validation.js,auth.docs.js,auth.events.js}

# USER
mkdir -p src/modules/user
touch src/modules/user/{user.model.js,user.controller.js,user.service.js,user.repository.js,user.validation.js,user.docs.js,user.events.js}

# ROLE
mkdir -p src/modules/role
touch src/modules/role/{role.model.js,role.controller.js,role.service.js,role.repository.js,role.validation.js,role.docs.js}

# PERMISSION
mkdir -p src/modules/permission
touch src/modules/permission/{permission.model.js,permission.controller.js,permission.service.js,permission.repository.js,permission.validation.js,permission.docs.js}

# STORE
mkdir -p src/modules/store
touch src/modules/store/{store.model.js,store.controller.js,store.service.js,store.repository.js,store.validation.js,store.docs.js,store.events.js}

# PRODUCT
mkdir -p src/modules/product/{shared,admin,client}

touch src/modules/product/product.model.js
touch src/modules/product/product.validation.js
touch src/modules/product/product.repository.js
touch src/modules/product/product.events.js

touch src/modules/product/shared/{product.shared.service.js,product.helpers.js,product.filters.js,product.aggregate.js}

touch src/modules/product/admin/{product.controller.js,product.service.js,product.docs.js,product.routes.js}

touch src/modules/product/client/{product.controller.js,product.service.js,product.docs.js,product.routes.js}

# CATEGORY
mkdir -p src/modules/category/{admin,client}

touch src/modules/category/{category.model.js,category.validation.js,category.repository.js}

touch src/modules/category/admin/{category.controller.js,category.service.js}

touch src/modules/category/client/{category.controller.js,category.service.js}

# BRAND
mkdir -p src/modules/brand
touch src/modules/brand/{brand.model.js,brand.controller.js,brand.service.js,brand.repository.js,brand.validation.js}

# ORDER
mkdir -p src/modules/order/{shared,admin,client}

touch src/modules/order/{order.model.js,order.validation.js,order.repository.js,order.events.js}

touch src/modules/order/shared/{order.helpers.js,payment.helpers.js}

touch src/modules/order/admin/{order.controller.js,order.service.js}

touch src/modules/order/client/{checkout.controller.js,checkout.service.js,order.controller.js,order.service.js}

# CART
mkdir -p src/modules/cart
touch src/modules/cart/{cart.model.js,cart.controller.js,cart.service.js,cart.repository.js,cart.validation.js}

# WISHLIST
mkdir -p src/modules/wishlist
touch src/modules/wishlist/{wishlist.model.js,wishlist.controller.js,wishlist.service.js,wishlist.repository.js}

# REVIEW
mkdir -p src/modules/review
touch src/modules/review/{review.model.js,review.controller.js,review.service.js,review.repository.js,review.validation.js}

# CUSTOMER
mkdir -p src/modules/customer
touch src/modules/customer/{customer.model.js,customer.controller.js,customer.service.js,customer.repository.js,customer.validation.js}

# NOTIFICATION
mkdir -p src/modules/notification
touch src/modules/notification/{notification.model.js,notification.controller.js,notification.service.js,notification.repository.js,notification.events.js}

# DASHBOARD
mkdir -p src/modules/dashboard
touch src/modules/dashboard/{dashboard.controller.js,dashboard.service.js,dashboard.repository.js}

# ANALYTICS
mkdir -p src/modules/analytics
touch src/modules/analytics/{analytics.controller.js,analytics.service.js,analytics.repository.js}

# COUPON
mkdir -p src/modules/coupon
touch src/modules/coupon/{coupon.model.js,coupon.controller.js,coupon.service.js,coupon.repository.js,coupon.validation.js}

# BANNER
mkdir -p src/modules/banner
touch src/modules/banner/{banner.model.js,banner.controller.js,banner.service.js,banner.repository.js,banner.validation.js}

# SETTINGS
mkdir -p src/modules/settings
touch src/modules/settings/{settings.model.js,settings.controller.js,settings.service.js,settings.repository.js}

# AUDIT
mkdir -p src/modules/audit
touch src/modules/audit/{audit.model.js,audit.controller.js,audit.service.js,audit.repository.js,audit.docs.js}

echo "✅ Ecommerce Backend Production Structure Created Successfully"