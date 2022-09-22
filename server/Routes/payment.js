const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY,
	key_secret: process.env.RAZORPAY_SECRET_KEY,
});

router.post("/orders", async (req, res) => {try {
		
	// const instance = new Razorpay({
	// 	key_id: process.env.RAZORPAY_KEY,
	// 	key_secret: process.env.RAZORPAY_SECRET_KEY,
	// });
		// console.log("  aaaaaaaMOUNT" , req.body.amount);
		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			// console.log("Payment .." , order)
			res.status(200).json({ data: order ,orderId:"orde101"});
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

router.post("/verify", async (req, res) => {
	try {

		
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature  , } =
			req.body;
			// console.log("testt..",	req.body ,  razorpay_signature)
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			

			let data = await instance.payments.fetch(razorpay_payment_id);
			let details = await instance.orders.fetchPayments(razorpay_order_id)

			console.log("DATA....." , data  , "details ... " , details)
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});



module.exports = router;
