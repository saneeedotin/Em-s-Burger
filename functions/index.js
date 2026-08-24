const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Trigger: When a new order is created in Firestore
 * Use case: Calculate loyalty points, send notification to kitchen, or send email to user.
 */
exports.onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const orderData = event.data.data();
  const orderId = event.params.orderId;

  console.log(`New order created: ${orderId}`, orderData);

  // Example backend logic: If order has a total, give them loyalty points
  if (orderData.user_id && orderData.total_amount) {
    const pointsEarned = Math.floor(orderData.total_amount * 0.1); // 10% back as points

    // We update loyalty in the background
    const userRef = admin.firestore().collection("users").doc(orderData.user_id);

    try {
      await admin.firestore().runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (userDoc.exists) {
          const currentPoints = userDoc.data().loyaltyPoints || 0;
          t.update(userRef, { loyaltyPoints: currentPoints + pointsEarned });
        }
      });
      console.log(`Awarded ${pointsEarned} points to user ${orderData.user_id}`);
    } catch (error) {
      console.error("Error updating loyalty points:", error);
    }
  }

  return true;
});

/**
 * Callable Function: Grant Admin Role
 * Use case: Allows an existing admin (or initial setup) to grant admin privileges to another user.
 */
exports.addAdminRole = onCall(async (request) => {
  // 1. Check if requester is an admin (Security)
  if (!request.auth || !request.auth.token.admin) {
    throw new HttpsError("permission-denied", "Only admins can add other admins.");
  }

  const { email } = request.data;
  if (!email) {
    throw new HttpsError("invalid-argument", "Email is required.");
  }

  try {
    // 2. Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // 3. Set admin custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    return { message: `Success! ${email} has been made an admin.` };
  } catch (error) {
    throw new HttpsError("internal", error.message);
  }
});
