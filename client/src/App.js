import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
	const [book, setBook] = useState({
		name: "",
		author: "",
		img: "https://images.unsplash.com/photo-1543233604-3baca4d35513?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwY3VwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
		price: 250.12,
	});

	const initPayment = (data) => {
		const options = {
			key: "rzp_test_MHFGEAwM6U2mEJ",
			amount: data.amount,
			currency: data.currency,
			name: book.name,
			description: "Test Transaction",
			image: book.img,
			order_id: data.id,
			handler: async (response) => {
				try {
					response.orderId = "ordert test"
					const verifyUrl = "http://localhost:8080/api/payment/verify";
					const { data } = await axios.post(verifyUrl, response );
					console.log(data);
				} catch (error) {
					console.log(error);
				}
			},
			theme: {
				color: "#3399cc",
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};

	const handlePayment = async () => {
		try {
			const orderUrl = "http://localhost:8080/api/payment/orders";
			const { data } = await axios.post(orderUrl, { amount: book.price });
			console.log(data);
			initPayment(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="App">
			<div className="book_container">
				<img src={book.img} alt="book_img" className="book_img" />
				
				<p className="book_price">
					Price : <span>&#x20B9; {book.price}</span>
				</p>
				<button onClick={handlePayment} className="buy_btn">
					buy now
				</button>
			</div>
		</div>
	);
}

export default App;
