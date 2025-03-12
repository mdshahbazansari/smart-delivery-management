# Next.js Order Management System

This is a **Next.js** project bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It is an **Order Management System** designed to manage orders efficiently, assign them to partners, and track their status.

## 🚀 Project Overview

The **Order Management System** provides an intuitive interface for handling orders, assigning them to delivery partners, and tracking their status. It features:

- **Order creation & management**
- **Assigning orders to partners**
- **Status tracking (Assigned, In Progress, Completed)**
- **User authentication**
- **API-based order handling**
- **Database integration with MongoDB**
- **Modern UI with Ant Design components**

## 🛠️ Technologies Used

- **Next.js** – React framework for server-side rendering
- **MongoDB & Mongoose** – Database management
- **Ant Design** – UI components
- **Axios** – API requests
- **Tailwind CSS** – Styling
- **Express.js** – Backend API handling

## 📌 Features

### ✅ Order Management

- Create, update, and delete orders
- Assign orders to partners
- Track order status

### ✅ User Authentication

- Secure login & signup
- Role-based access

### ✅ Partner Management

- Assign and track partner activities
- Monitor partner performance

### ✅ Real-time Status Updates

- Orders update dynamically
- View order history

## 🔥 API Endpoints

### 1️⃣ **Order APIs**

#### Create an Order

**POST** `/api/orders/create`

```json
{
  "customerName": "John Doe",
  "product": "Laptop",
  "quantity": 2,
  "area": "Downtown",
  "status": "pending"
}
```

#### Get All Orders

**GET** `/api/orders`

#### Get Order by ID

**GET** `/api/orders/:id`

#### Assign Order to Partner

**POST** `/api/orders/assign`

```json
{
  "orderId": "123456789",
  "partnerId": "987654321",
  "status": "assigned",
  "area": "Downtown"
}
```

### 2️⃣ **User APIs**

#### User Signup

**POST** `/api/auth/signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### User Login

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### 3️⃣ **Partner APIs**

#### Get All Partners

**GET** `/api/partners`

#### Get Partner by ID

**GET** `/api/partners/:id`

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌎 Deployment

The easiest way to deploy your Next.js app is to use **[Vercel](https://vercel.com)**:

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

## 📚 Learn More

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) – Features and API details.
- [Learn Next.js](https://nextjs.org/learn) – Interactive tutorial.

---

### 💡 **Contributing**

Contributions are welcome! If you find a bug or want to suggest an improvement, feel free to create an issue or submit a pull request.

### 📧 **Contact**

For support, reach out at **support@example.com**.
