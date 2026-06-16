# FarmXChain - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [User Roles & Access](#user-roles--access)
4. [Complete Workflow Guide](#complete-workflow-guide)
5. [Page-by-Page Documentation](#page-by-page-documentation)
6. [Technical Stack](#technical-stack)

---

## 🌾 Project Overview

**FarmXChain** is a blockchain-powered agricultural supply chain management platform that connects farmers directly with distributors, retailers, and consumers. The platform provides transparency, traceability, and efficient transaction management across the entire agricultural supply chain.

### Key Features
- **Multi-Role System**: Supports Farmers, Distributors, Retailers, Consumers, and Admins
- **Blockchain Integration**: Ethereum-based smart contracts for crop registry
- **Real-time Tracking**: Order tracking and logistics management
- **Secure Transactions**: Wallet-based payment system
- **Admin Oversight**: Comprehensive admin panel for platform management

---

## 🏗️ System Architecture

### Technology Stack

#### Backend
- **Framework**: Spring Boot (Java)
- **Database**: MySQL
- **Blockchain**: Ethereum (Solidity Smart Contracts)
- **API**: RESTful services
- **Security**: JWT Authentication

#### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)

### Project Structure
```
FarmXChain/
├── backend/
│   ├── src/main/java/com/infosys/farmxchain/
│   │   ├── controller/     # REST API endpoints
│   │   ├── service/        # Business logic
│   │   ├── entity/         # Database models
│   │   └── repository/     # Data access layer
│   └── src/main/resources/
│       ├── contracts/      # Solidity smart contracts
│       └── database-setup.sql
└── frontend/
    └── src/
        ├── pages/          # React page components
        ├── services/       # API service layer
        └── utils/          # Helper utilities
```

---

## 👥 User Roles & Access

### 1. **FARMER** 🚜
**Purpose**: Producers who list and sell agricultural products

**Access Rights**:
- Create and manage farmer profile
- Add/edit/delete crop listings
- Set crop prices
- View and manage orders
- Track sales history
- Manage wallet balance

**Restricted From**:
- Admin functions
- Other farmers' data
- System-wide statistics

---

### 2. **DISTRIBUTOR** 🚚
**Purpose**: Bulk buyers who purchase from farmers and supply to retailers

**Access Rights**:
- Browse marketplace
- Purchase crops in bulk
- View farmer profiles and details
- Manage orders
- Track deliveries
- Manage wallet balance

**Restricted From**:
- Listing crops
- Admin functions
- Farmer verification

---

### 3. **RETAILER** 🏪
**Purpose**: Store owners who buy from distributors/farmers and sell to consumers

**Access Rights**:
- Browse marketplace
- Purchase crops
- View farmer details
- Manage orders
- Track deliveries
- Manage wallet balance

**Restricted From**:
- Listing crops
- Admin functions
- Bulk distributor features

---

### 4. **CONSUMER** 🛒
**Purpose**: End customers who purchase agricultural products

**Access Rights**:
- Browse marketplace
- Purchase crops for personal use
- View farmer profiles
- Track orders
- Manage wallet balance

**Restricted From**:
- Listing crops
- Admin functions
- Bulk purchasing features

---

### 5. **ADMIN** 👨‍💼
**Purpose**: Platform administrators who oversee and manage the entire system

**Access Rights**:
- **Full System Access**
- User management (all roles)
- Farmer verification/approval
- View all transactions
- Platform statistics
- User account control (block/unblock)
- System monitoring

**Responsibilities**:
- Verify farmer authenticity
- Monitor platform integrity
- Resolve disputes
- Manage user accounts
- Oversee transactions

---

## 🔄 Complete Workflow Guide

### Complete System Flow

```mermaid
graph TB
    subgraph "Farmer Journey"
        F1[Register as Farmer] --> F2[Admin Verification]
        F2 --> F3[Create Profile]
        F3 --> F4[List Crops]
        F4 --> F5[Receive Order]
        F5 --> F6[Assign Distributor]
        F6 --> F7[Track Delivery]
        F7 --> F8[Receive Payment]
    end
    
    subgraph "Buyer Journey Consumer/Retailer/Distributor"
        B1[Browse Marketplace] --> B2[Select Crop]
        B2 --> B3[Provide Delivery Address]
        B3 --> B4[Place Order]
        B4 --> B5[Track Shipment]
        B5 --> B6[Receive Delivery]
        B6 --> B7[Confirm Receipt]
    end
    
    subgraph "Distributor Logistics Journey"
        D1[View Assigned Orders] --> D2[Create Shipment]
        D2 --> D3[Update Location/Conditions]
        D3 --> D4[Confirm Delivery]
        D4 --> D5[Generate Custody Hash]
        D5 --> D6[Receive Earnings]
    end
    
    subgraph "Admin Oversight"
        A1[Verify Farmers] --> A2[Monitor Transactions]
        A2 --> A3[Manage Users]
        A3 --> A4[View Platform Stats]
    end
    
    F4 --> B1
    B4 --> F5
    F6 --> D1
    D4 --> B6
```

---

### Order Lifecycle & Status Flow

```mermaid
graph LR
    PENDING[PENDING<br/>Order Placed] --> ACCEPTED[ACCEPTED<br/>Farmer Accepts]
    ACCEPTED --> ASSIGNED[ASSIGNED<br/>Distributor Assigned]
    ASSIGNED --> IN_TRANSIT[IN_TRANSIT<br/>Shipment Started]
    IN_TRANSIT --> DELIVERED[DELIVERED<br/>Shipment Delivered]
    DELIVERED --> COMPLETED[COMPLETED<br/>Buyer Confirms]
    
    PENDING -.Rejection.-> REJECTED[REJECTED]
    PENDING -.Cancellation.-> CANCELLED[CANCELLED]
    ACCEPTED -.Cancellation.-> CANCELLED
```

**Order Status Definitions**:
- **PENDING**: Order placed by buyer, awaiting farmer acceptance
- **ACCEPTED**: Farmer has accepted the order
- **REJECTED**: Farmer rejected the order (insufficient stock, etc.)
- **ASSIGNED**: Order assigned to a distributor for delivery
- **IN_TRANSIT**: Distributor started shipment, goods in transit
- **DELIVERED**: Distributor confirmed delivery at buyer's location
- **COMPLETED**: Buyer confirmed receipt of goods
- **CANCELLED**: Order cancelled by buyer or system

---

### Workflow 1: Complete Farmer Journey

```mermaid
graph TD
    A[Farmer Registers] --> B[Admin Reviews Profile]
    B --> C{Approved?}
    C -->|Yes| D[Farmer Creates Profile]
    C -->|No| E[Registration Rejected]
    D --> F[Add Crop Listings]
    F --> G[Crops on Marketplace]
    G --> H[Receive Order PENDING]
    H --> I{Accept Order?}
    I -->|Yes| J[Status: ACCEPTED]
    I -->|No| K[Status: REJECTED]
    J --> L[Assign Distributor]
    L --> M[Status: ASSIGNED]
    M --> N[Distributor Creates Shipment]
    N --> O[Status: IN_TRANSIT]
    O --> P[Distributor Confirms Delivery]
    P --> Q[Status: DELIVERED]
    Q --> R[Buyer Confirms Receipt]
    R --> S[Status: COMPLETED]
    S --> T[Payment to Farmer Wallet]
    T --> U[View Earnings History]
```

**Detailed Steps**:

1. **Registration & Verification**
   - Farmer creates account with email/password
   - Status set to `PENDING` (awaits admin verification)
   - Admin reviews farmer credentials and farm details
   - Admin approves → Status becomes `ACTIVE`

2. **Profile Setup**
   - Fill in farm name, location, contact details
   - Add farm size and certifications
   - Upload profile photo (optional)

3. **Crop Management**
   - Navigate to Crop Management page
   - Add crops with:
     - Crop name (e.g., Wheat, Rice, Tomatoes)
     - Quantity available (in kg)
     - Price per kg (₹)
     - Image upload for crop
     - Description (optional)
   - Crops automatically listed on marketplace
   - Edit/Delete crops as needed

4. **Order Management**
   - View incoming orders on Orders page
   - Orders arrive in `PENDING` status
   - Review order details (buyer, quantity, total price)
   - Accept or reject based on availability
   - Accepted orders → Status changes to `ACCEPTED`

5. **Distributor Assignment**
   - Assign available distributor to accepted orders
   - Order status changes to `ASSIGNED`
   - Distributor receives notification
   - Delivery address shown to distributor

6. **Shipment Tracking**
   - Monitor shipment progress
   - View real-time location updates from distributor
   - Check environmental conditions (temperature, humidity)
   - View shipment logs and blockchain transaction hashes

7. **Order Completion & Earnings**
   - Order status updates to `DELIVERED` when distributor confirms
   - Buyer confirms receipt → Status becomes `COMPLETED`
   - Payment already in farmer's wallet (deducted on order placement)
   - View earnings history and transaction details

---

### Workflow 2: Complete Distributor Journey

```mermaid
graph TD
    D1[Login as Distributor] --> D2[View Assigned Orders]
    D2 --> D3[See Order Details]
    D3 --> D4[Check Delivery Address]
    D4 --> D5[Create Shipment]
    D5 --> D6[Set Origin Farm Location]
    D6 --> D7[Set Destination Buyer Address]
    D7 --> D8[Select Transport Mode]
    D8 --> D9[Status: IN_TRANSIT]
    D9 --> D10[Update Location During Transit]
    D10 --> D11[Log Temperature/Humidity]
    D11 --> D12[Add Shipment Notes]
    D12 --> D13{Arrived?}
    D13 -->|No| D10
    D13 -->|Yes| D14[Confirm Delivery]
    D14 --> D15[Generate Custody Hash]
    D15 --> D16[Status: DELIVERED]
    D16 --> D17[Record on Blockchain]
    D17 --> D18[View Earnings History]
```

**Detailed Steps**:

1. **Access Distributor Dashboard**
   - Login with distributor credentials
   - View dashboard with statistics:
     - Assigned orders (not yet shipped)
     - In-transit shipments
     - Delivered orders
     - Total orders handled

2. **View Assigned Orders**
   - Orders with status `ASSIGNED` appear in dashboard
   - Table shows:
     - Order ID
     - Crop name and quantity
     - Buyer name
     - **Delivery address** (provided by buyer)
     - Farm location (pickup point)

3. **Create Shipment**
   - Click "Create Shipment" on assigned order
   - Form auto-fills:
     - **Origin**: Farm location from farmer profile
     - **Destination**: Buyer's delivery address
   - Select transport mode:
     - 🚚 Truck
     - 🚂 Train
     - 🚢 Ship
     - ✈️ Air
     - 📦 Other
   - Submit shipment
   - Order status changes to `IN_TRANSIT`
   - Blockchain transaction logged

4. **Update Shipment Status During Transit**
   - Click "Update" on in-transit shipment
   - Provide:
     - **Current Location**: e.g., "Highway 101, Near City XYZ"
     - **Temperature (°C)**: Environmental condition
     - **Humidity (%)**: Environmental condition
     - **Notes**: Optional status notes
   - Each update creates a shipment log entry
   - Blockchain transaction recorded for traceability

5. **Confirm Delivery**
   - Upon arrival at buyer's location
   - Click "Deliver" button
   - Add delivery notes (optional)
   - System:
     - Generates immutable **custody transfer hash**
     - Records blockchain transaction
     - Changes order status to `DELIVERED`
     - Creates delivery log entry
   - Custody hash proves delivery authenticity

6. **View Shipment Logs**
   - Click "Logs" on any in-transit or delivered shipment
   - See complete history:
     - PICKED_UP: Initial shipment creation
     - STATUS_UPDATE: Each location/condition update
     - DELIVERED: Final delivery confirmation
   - Each log includes:
     - Timestamp
     - Action type
     - Location
     - Notes
     - Blockchain transaction hash (if applicable)

7. **Track Earnings**
   - Navigate to Earnings History page
   - View all completed deliveries
   - See payment amounts for each delivery
   - Filter by date range
   - Export earnings report

---

### 🚚 Distributor & Logistics Management

#### **Distributor Dashboard** (`/distributor-dashboard`)
**Purpose**: Comprehensive shipment management for distributors

**Available To**: Distributors only

**Key Features**:

1. **Order Statistics Dashboard**
   - Assigned: Orders waiting for shipment creation
   - In Transit: Active shipments being delivered
   - Delivered: Completed deliveries
   - Total Orders: All-time order count

2. **Tabbed Order View**
   - **Assigned Orders**: New orders ready for pickup
   - **In Transit**: Shipments currently being delivered
   - **Delivered**: Successfully delivered orders
   - **All Orders**: Complete order history

3. **Order Table Columns**
   - Order ID
   - Crop name and quantity
   - Buyer name
   - **Delivery Address**: Full address provided by buyer
   - Status badge
   - Action buttons

4. **Create Shipment** (for ASSIGNED orders)
   - **Origin**: Auto-filled with farm location
   - **Destination**: Auto-filled with buyer's delivery address
   - **Transport Mode**: Select from Truck/Train/Ship/Air/Other
   - Creates blockchain transaction
   - Changes order status to IN_TRANSIT

5. **Update Shipment Status** (for IN_TRANSIT orders)
   - **Current Location**: Real-time location update
   - **Temperature (°C)**: Environmental monitoring
   - **Humidity (%)**: Environmental monitoring
   - **Notes**: Optional status notes
   - Each update creates shipment log
   - Blockchain transaction recorded

6. **Confirm Delivery** (for IN_TRANSIT orders)
   - Add delivery notes
   - System generates immutable **custody transfer hash**
   - Blockchain transaction for proof
   - Order status changes to DELIVERED

7. **View Shipment Logs**
   - Complete audit trail:
     - PICKED_UP: Initial shipment
     - STATUS_UPDATE: Each location/condition update
     - DELIVERED: Final delivery
   - Shows:
     - Timestamp
     - Action type
     - Location
     - Notes
     - Blockchain transaction hash

**Earnings Tracking**:
- Navigate to Earnings History page (`/earnings-history`)
- View all completed deliveries
- Track payment amounts
- Filter by date range
- Export earnings reports

---

#### **Shipment Management System**

**Shipment Status Flow**:
```mermaid
graph LR
    PICKED_UP[PICKED_UP<br/>Shipment Created] --> IN_TRANSIT[IN_TRANSIT<br/>En Route]
    IN_TRANSIT --> DELIVERED[DELIVERED<br/>At Destination]
    IN_TRANSIT -.Issue.-> DELAYED[DELAYED]
    DELAYED -.Resume.-> IN_TRANSIT
    IN_TRANSIT -.Cancel.-> CANCELLED[CANCELLED]
```

**Shipment Status Definitions**:
- **PICKED_UP**: Distributor created shipment, goods picked up from farm
- **IN_TRANSIT**: Shipment en route to destination
- **DELIVERED**: Goods delivered to buyer's address
- **DELAYED**: Shipment delayed due to issues
- **CANCELLED**: Shipment cancelled

**Shipment Data Tracked**:
- Order reference
- Distributor ID and name
- Origin (farm location)
- Destination (buyer delivery address)
- Transport mode (Truck/Train/Ship/Air/Other)
- Current location
- Temperature readings (°C)
- Humidity readings (%)
- Blockchain transaction hash
- Custody transfer hash (on delivery)
- Last updated timestamp

**Shipment Logs**:
Each shipment maintains detailed logs:
- **Action Types**:
  - PICKED_UP: Initial pickup from farm
  - STATUS_UPDATE: Location/condition update during transit
  - DELIVERED: Final delivery confirmation
- **Log Data**:
  - Timestamp
  - Action type
  - Location
  - Notes
  - Blockchain transaction hash (if applicable)

**Blockchain Integration**:
- Every shipment action logged on Ethereum blockchain
- Immutable record for traceability
- Transaction hash stored with each log
- **Custody Hash**: Generated on delivery using SHA-256:
  - Order ID
  - Shipment ID
  - Delivery timestamp
  - Distributor ID
  - Creates tamper-proof delivery proof
  - Ensures authenticity and non-repudiation

**Temperature & Humidity Monitoring**:
- Distributors log environmental conditions during transit
- Critical for perishable agricultural products
- Helps ensure product quality
- Stored in shipment logs for audit trail
- Can trigger alerts if conditions exceed thresholds (future enhancement)

---

#### **Earnings History** (`/earnings-history`)
**Purpose**: Track distributor earnings from completed deliveries

**Available To**: Distributors only

**Features**:
- Table of all completed deliveries
- Columns:
  - Date
  - Order ID
  - Crop delivered
  - Quantity
  - Earnings amount
  - Buyer information
- Filter by date range
- Search functionality
- Total earnings summary
- Export to CSV/PDF (if implemented)

---

### Workflow 3: Complete Consumer/Buyer Journey

```mermaid
graph TD
    C1[Login as Buyer] --> C2[Browse Marketplace]
    C2 --> C3[Search/Filter Crops]
    C3 --> C4[View Crop Details]
    C4 --> C5[Click Buy Now]
    C5 --> C6[Enter Quantity]
    C6 --> C7[Enter Delivery Address]
    C7 --> C8[Calculate Total Price]
    C8 --> C9{Sufficient Balance?}
    C9 -->|No| C10[Add Funds to Wallet]
    C10 --> C11[Place Order]
    C9 -->|Yes| C11
    C11 --> C12[Payment Deducted]
    C12 --> C13[Order Status: PENDING]
    C13 --> C14[Farmer Accepts]
    C14 --> C15[Status: ACCEPTED]
    C15 --> C16[Distributor Assigned]
    C16 --> C17[Status: ASSIGNED]
    C17 --> C18[Shipment Created]
    C18 --> C19[Status: IN_TRANSIT]
    C19 --> C20[Track Shipment]
    C20 --> C21[Real-time Updates]
    C21 --> C22[Delivery Received]
    C22 --> C23[Status: DELIVERED]
    C23 --> C24[Confirm Receipt]
    C24 --> C25[Status: COMPLETED]
```

**Detailed Steps**:

1. **Browse Marketplace**
   - Navigate to Marketplace page
   - View all available crops
   - Use search bar to find specific crops
   - Filter by category or farmer
   - Sort by price (low to high, high to low)

2. **Select Crop & Place Order**
   - Click on crop card to view details
   - See:
     - Farmer name and location
     - Price per kg
     - Available quantity
     - Crop description
     - Crop image
   - Click "Buy Now" button
   - Modal opens with order form

3. **Order Form**
   - **Quantity**: Enter desired amount (in kg)
   - **Delivery Address**: Provide complete delivery address
     - Street address
     - City, State, PIN code
     - Landmark (optional)
   - System calculates:
     - `Total Price = Quantity × Price per kg`
   - Display current wallet balance
   - Validation:
     - Quantity must be ≤ available stock
     - Quantity must be > 0
     - Wallet balance must be ≥ Total price

4. **Payment & Confirmation**
   - Click "Confirm Purchase"
   - System processes:
     - Deducts amount from buyer's wallet
     - Credits amount to farmer's wallet
     - Creates order record
     - Stores delivery address with order
   - Order status: `PENDING`
   - Success message displayed

5. **Track Order**
   - Navigate to Orders page
   - View order in "Active Orders" tab
   - Monitor status changes:
     - `PENDING` → Awaiting farmer acceptance
     - `ACCEPTED` → Farmer confirmed order
     - `ASSIGNED` → Distributor assigned
     - `IN_TRANSIT` → Goods being shipped
     - `DELIVERED` → Arrived at delivery address
   - Click "Track" to see detailed tracking page

6. **Shipment Tracking**
   - View tracking timeline:
     - ✓ Order Placed
     - ✓ Farmer Accepted
     - ✓ Distributor Assigned
     - ⏳ In Transit (current)
     - ○ Delivered
     - ○ Completed
   - See shipment details:
     - Current location
     - Last update timestamp
     - Temperature and humidity readings
     - Distributor information
     - Blockchain transaction hashes

7. **Receive & Confirm Delivery**
   - Distributor arrives with goods
   - Order status changes to `DELIVERED`
   - Buyer verifies goods received
   - Click "Confirm Receipt" button
   - Order status changes to `COMPLETED`
   - Order moves to "Past Orders" tab
   - Can view complete order history and shipment logs

---

### Workflow 4: Admin Management Journey

```mermaid
graph TD
    A[Admin Dashboard] --> B[View All Users]
    B --> C{Select Action}
    C -->|View Details| D[User Profile]
    C -->|Verify Farmer| E[Farmer Verification Page]
    C -->|Block User| F[Suspend Account]
    C -->|View Transactions| G[Transaction History]
    E --> H{Approve?}
    H -->|Yes| I[Farmer Activated]
    H -->|No| J[Farmer Rejected]
```

**Step-by-Step**:
1. **Access Dashboard**: Admin logs in
2. **User Overview**: View total users by role
3. **User Management**: Click "Users" to see all accounts
4. **Filter by Role**: Use tabs (Farmers, Distributors, Retailers, Consumers)
5. **Verification Queue**: Check pending farmer verifications
6. **Review Credentials**: Examine farmer details
7. **Approve/Reject**: Make verification decision
8. **Account Control**: Block/unblock users if needed
9. **Transaction Monitoring**: View all platform transactions

---

## 📄 Page-by-Page Documentation

### 🔐 Authentication Pages

#### **Login Page** (`/login`)
**Purpose**: User authentication entry point

**Features**:
- Email/password login
- Role-based redirection
- "Remember me" option
- Link to registration

**Workflow**:
1. User enters credentials
2. System validates against database
3. JWT token generated
4. User redirected based on role:
   - Admin → `/admin-dashboard`
   - Farmer → `/dashboard`
   - Others → `/marketplace`

**Validation**:
- Email format check
- Password minimum length
- Account status verification (not blocked)

---

#### **Register Page** (`/register`)
**Purpose**: New user account creation

**Form Fields**:
- Name (required)
- Email (required, unique)
- Password (required, min 6 chars)
- Role selection (Farmer/Distributor/Retailer/Consumer)

**Workflow**:
1. User fills registration form
2. System validates input
3. Account created with status:
   - Farmer → `PENDING` (awaits verification)
   - Others → `ACTIVE`
4. Initial wallet balance: ₹0
5. Redirect to login

**Validation Rules**:
- Unique email
- Password strength
- All required fields filled

---

### 🌾 Farmer Pages

#### **Farmer Dashboard** (`/dashboard`)
**Purpose**: Farmer's main control panel

**Displayed Information**:
- Total crops listed
- Total sales/revenue
- Pending orders
- Recent activity

**Quick Actions**:
- Add new crop
- View orders
- Manage profile
- Check wallet balance

**Access**: Farmers only

---

#### **Farmer Profile** (`/farmer-profile`)
**Purpose**: Manage farmer business information

**Editable Fields**:
- Farm name
- Location/address
- Contact details
- Farm size
- Certifications
- Bio/description

**Features**:
- Profile photo upload
- Verification status display
- Public profile preview

**Workflow**:
1. Navigate to "My Profile"
2. Click "Edit Profile"
3. Update information
4. Save changes
5. Profile updated in database

---

#### **Crop Management** (`/crop-management`)
**Purpose**: Add, edit, and delete crop listings

**Crop Form Fields**:
- Crop name (required)
- Quantity in kg (required, number)
- Price per kg (required, number)
- Description (optional)
- Category (optional)

**Features**:
- **Add Crop**: Create new listing
- **Edit Crop**: Update existing crop details
- **Delete Crop**: Remove listing (if no active orders)
- **View All**: Table of all farmer's crops

**Table Columns**:
| Crop Name | Quantity (kg) | Price/kg | Total Value | Actions |
|-----------|---------------|----------|-------------|---------|
| Wheat     | 500          | ₹25      | ₹12,500     | Edit/Delete |

**Business Rules**:
- Cannot delete crop with pending orders
- Price must be positive
- Quantity must be positive

---

### 🛒 Marketplace & Shopping

#### **Marketplace** (`/marketplace`)
**Purpose**: Central hub for browsing and purchasing crops

**Available To**: All authenticated users

**Features**:
- **Search Bar**: Filter crops by name
- **Category Filter**: Filter by crop type
- **Farmer Filter**: View crops from specific farmer
- **Sort Options**: 
  - Price (low to high)
  - Price (high to low)
  - Quantity available

**Crop Card Display**:
```
┌─────────────────────────┐
│  Crop Image             │
│  Crop Name              │
│  Farmer: [Name]         │
│  Price: ₹XX/kg          │
│  Available: XXX kg      │
│  [Buy Now] [View Details]│
└─────────────────────────┘
```

**Purchase Flow**:
1. Click "Buy Now" on crop card
2. Modal opens with:
   - Crop details
   - Quantity input
   - Total price calculation
   - Wallet balance display
3. Enter desired quantity
4. System calculates: `Total = Quantity × Price/kg`
5. Click "Confirm Purchase"
6. Order created, payment processed
7. Success message displayed

**Validation**:
- Quantity ≤ Available stock
- Buyer balance ≥ Total price
- Quantity > 0

---

#### **Farmer List** (`/farmer-list`)
**Purpose**: Directory of all verified farmers

**Available To**: Distributors, Retailers, Consumers, Admin

**Display Format**:
- Grid/List view of farmer cards
- Each card shows:
  - Farmer name
  - Location
  - Number of crops
  - Rating (if implemented)
  - "View Profile" button

**Features**:
- Search farmers by name/location
- Filter by verification status
- Click to view detailed farmer profile

---

#### **Farmer Details** (`/farmers/:id`)
**Purpose**: Detailed view of individual farmer

**Sections**:
1. **Farmer Information**:
   - Name, location, contact
   - Farm details
   - Verification badge
   - Member since date

2. **Available Crops**:
   - List of all crops from this farmer
   - Direct purchase option
   - Stock availability

3. **Reviews** (if implemented):
   - Customer feedback
   - Rating statistics

---

### 📦 Order Management

#### **Orders Page** (`/orders`)
**Purpose**: View and manage all user orders

**Available To**: Farmers, Distributors, Retailers, Consumers

**Two Perspectives**:

**For Buyers** (Distributor/Retailer/Consumer):
- **My Purchases**: Orders placed by user
- Columns:
  - Order ID
  - Crop name
  - Farmer name
  - Quantity
  - Total price
  - Status
  - Track button

**For Farmers**:
- **Sales**: Orders received for farmer's crops
- Columns:
  - Order ID
  - Crop name
  - Buyer name
  - Quantity
  - Total price
  - Status
  - Actions

**Order Statuses**:
- `PENDING`: Order placed, awaiting processing
- `CONFIRMED`: Farmer confirmed order
- `SHIPPED`: In transit
- `DELIVERED`: Completed
- `CANCELLED`: Order cancelled

**Actions**:
- **Track Order**: View delivery status
- **View Details**: Full order information
- **Cancel** (if status = PENDING)

---

#### **Order Tracking** (`/tracking/:orderId`)
**Purpose**: Real-time order status tracking

**Display Elements**:
- Order ID and date
- Current status
- Estimated delivery
- Progress timeline:
  ```
  ✓ Order Placed
  ✓ Confirmed
  ⏳ In Transit
  ○ Delivered
  ```
- Logistics details (if available)
- Farmer/Buyer information

**Features**:
- Status updates
- Delivery location tracking (if GPS enabled)
- Contact farmer/support

---

### 👨‍💼 Admin Pages

#### **Admin Dashboard** (`/admin-dashboard`)
**Purpose**: Central admin control panel

**Key Metrics Displayed**:
- Total users (all roles)
- Total farmers
- Pending verifications
- Active users
- Recent transactions

**Quick Access Cards**:
1. **Transactions**: Link to all platform transactions
2. **User Management**: Access user database
3. **Verifications**: Pending farmer approvals

**Features**:
- System status indicator
- Refresh data button
- Navigation to all admin functions

---

#### **User Management** (`/user-management`)
**Purpose**: Comprehensive user database management

**Features**:
- **Tabbed Interface**:
  - All Users
  - Farmers
  - Distributors
  - Retailers
  - Consumers

**Each Tab Shows**:
- Count badge (e.g., "Farmers: 45")
- Percentage of total users

**User Table Columns**:
| Name | Email | Role | Status | Balance | Actions |
|------|-------|------|--------|---------|---------|
| John | john@email | FARMER | ACTIVE | ₹5,000 | Block/View |

**Actions Available**:
- **View Details**: Full user profile
- **Block User**: Suspend account access
- **Unblock User**: Restore account
- **Delete** (if no transactions)

**Search & Filter**:
- Search by name/email
- Filter by status (Active/Suspended)
- Sort by registration date

**Visual Indicators**:
- Blocked accounts: Dimmed/grayed out
- Status badges: Color-coded

---

#### **Farmer Verification** (`/farmer-verification`)
**Purpose**: Review and approve farmer registrations

**Pending Farmers List**:
- Shows all farmers with `PENDING` status
- Displays:
  - Farmer name
  - Email
  - Registration date
  - Farm details
  - Documents (if uploaded)

**Verification Process**:
1. Admin clicks "Review" on pending farmer
2. Modal/page shows:
   - Full farmer profile
   - Farm information
   - Contact details
   - Submitted documents
3. Admin reviews credentials
4. Decision:
   - **Approve**: Status → `ACTIVE`, farmer can list crops
   - **Reject**: Account remains `PENDING` or deleted

**Approval Criteria** (Admin Guidelines):
- Valid farm location
- Legitimate contact information
- Proper documentation
- No duplicate accounts

---

#### **Statistics Page** (`/statistics`)
**Purpose**: Platform analytics and insights

**Metrics Displayed**:
- Total users by role (pie chart)
- Total transactions
- Total revenue
- Crops listed
- Active orders
- Growth trends (if implemented)

**Charts & Graphs**:
- User distribution
- Sales over time
- Top-selling crops
- Top farmers by sales

**Export Options**:
- Download reports (CSV/PDF)
- Date range filters

---

#### **Admin Orders/Transactions** (`/admin/orders`)
**Purpose**: View all platform transactions

**Comprehensive Table**:
| Order ID | Date | Farmer | Buyer | Crop | Qty | Price | Status |
|----------|------|--------|-------|------|-----|-------|--------|
| #1234 | Jan 25 | John | Alice | Wheat | 50kg | ₹1,250 | Delivered |

**Features**:
- **Search**: By order ID, farmer, buyer, crop
- **Filter**: By status, date range, role
- **Sort**: By date, amount, status
- **Export**: Transaction reports

**Use Cases**:
- Monitor platform activity
- Resolve disputes
- Track revenue
- Audit transactions

---

### 👤 User Profile Pages

#### **User Profile** (`/profile`)
**Purpose**: Personal account management for non-farmers

**Available To**: Distributors, Retailers, Consumers

**Editable Information**:
- Name
- Email
- Phone number
- Delivery address
- Password change

**Displayed Information**:
- Account type (role)
- Member since
- Total orders
- Wallet balance

**Features**:
- Update profile
- Change password
- View order history
- Manage wallet

---

## 💰 Wallet System

### How It Works

**Initial Balance**: ₹0 for all new users

**Adding Funds** (Not fully implemented in current version):
- Users would add money via payment gateway
- Admin can manually adjust balances

**Deductions**:
- Automatic when placing orders
- Formula: `New Balance = Current Balance - Order Total`

**Credits**:
- Farmers receive payment when order is placed
- Formula: `New Balance = Current Balance + Order Total`

**Balance Display**:
- Shown in navbar for all users
- Format: ₹X,XXX
- Updates in real-time after transactions

**Insufficient Balance**:
- Order placement blocked
- Error message: "Insufficient wallet balance"
- Prompt to add funds

---

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure session management
- **Password Hashing**: Encrypted storage
- **Role-Based Access**: Route protection

### Authorization
- **Route Guards**: `AuthGuard` component
- **API Validation**: Backend role checks
- **Token Expiry**: Automatic logout

### Data Protection
- **Input Validation**: Frontend and backend
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: React's built-in escaping

---

## 🔗 Blockchain Integration

### Smart Contracts & Ethereum Integration

**CropRegistry.sol**:
- Stores crop information on Ethereum blockchain
- Immutable crop records upon listing
- Ownership verification
- Transaction history for complete traceability

**Blockchain Service Features**:

1. **Crop Registration**
   - When farmer lists a new crop:
     - Crop details sent to smart contract
     - Transaction hash returned and stored
     - Immutable record created on blockchain
     - Proves crop authenticity and origin

2. **Order Tracking**
   - Each order creates a blockchain transaction
   - Records:
     - Farmer ID
     - Buyer ID
     - Crop ID
     - Quantity
     - Price
     - Timestamp
   - Cannot be altered or deleted

3. **Shipment Logging**
   - Every shipment action logged on blockchain:
     - **PICKED_UP**: Initial shipment creation
     - **STATUS_UPDATE**: Each location/condition update
     - **DELIVERED**: Final delivery confirmation
   - Each log includes:
     - Order ID
     - Location
     - Condition data (temperature, humidity)
     - Timestamp
   - Transaction hash stored for verification

4. **Custody Transfer Hash**
   - Generated using SHA-256 algorithm on delivery:
     ```
     Hash = SHA256(orderId + shipmentId + timestamp + distributorId)
     ```
   - Immutable proof of delivery
   - Stored on blockchain
   - Prevents delivery disputes
   - Non-repudiable evidence of handoff

**Benefits**:
- **Transparency**: All stakeholders can verify transactions
- **Traceability**: Complete farm-to-consumer journey tracked
- **Tamper-proof**: Records cannot be altered after creation
- **Trust Building**: Blockchain provides independent verification
- **Dispute Resolution**: Immutable records settle conflicts
- **Food Safety**: Track environmental conditions throughout supply chain
- **Authenticity**: Verify crop origin and farmer credentials

**Technical Implementation**:
- Ethereum network used for smart contracts
- Web3.js for blockchain interaction (backend)
- Transaction hashes displayed to users for verification
- Gas fees handled by platform (not user-facing in current version)
- Fallback handling if blockchain service unavailable

**Blockchain Data Points**:
- Crop registrations
- Order placements
- Shipment pickups
- Location updates during transit
- Environmental condition logs
- Delivery confirmations
- Custody transfer proofs

---

## 📱 Responsive Design

All pages are fully responsive:
- **Mobile**: Optimized for phones
- **Tablet**: Adapted layouts
- **Desktop**: Full-featured interface

**Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 🚀 Getting Started Guide

### For Farmers
1. Register with role "Farmer"
2. Wait for admin approval
3. Create farmer profile
4. Add crops with prices
5. Manage orders as they come in

### For Buyers (Distributor/Retailer/Consumer)
1. Register with appropriate role
2. Account activated immediately
3. Browse marketplace
4. Add funds to wallet (if needed)
5. Purchase crops
6. Track orders

### For Admins
1. Login with admin credentials
2. Review pending farmer verifications
3. Monitor user activity
4. Manage user accounts
5. View transaction reports

---

## 📞 Support & Troubleshooting

### Common Issues

**"Insufficient Balance"**:
- Solution: Add funds to wallet

**"Order Failed"**:
- Check internet connection
- Verify crop availability
- Ensure sufficient balance

**"Access Denied"**:
- Verify correct role
- Check if account is blocked
- Re-login to refresh session

**Farmer "Pending Status"**:
- Wait for admin verification
- Contact admin if delayed

---

## 📊 Database Schema Overview

### Key Tables
- **users**: All user accounts
- **farmers**: Farmer-specific details
- **crops**: Crop listings
- **orders**: Transaction records
- **logistics**: Delivery tracking

### Relationships
- User → Farmer (1:1)
- Farmer → Crops (1:Many)
- User → Orders (1:Many)
- Order → Logistics (1:1)

---

## 🎯 Future Enhancements

Potential features for expansion:
- Payment gateway integration
- Real-time chat support
- Review/rating system
- Advanced analytics
- Mobile app
- GPS tracking
- Multi-language support
- Automated notifications

---

## 📝 Conclusion

FarmXChain provides a comprehensive platform for agricultural supply chain management, connecting all stakeholders in a transparent, efficient, and secure ecosystem. Each user role has specific capabilities designed to streamline their workflow while maintaining platform integrity through admin oversight.

---

**Document Version**: 2.0  
**Last Updated**: February 2, 2026  
**Platform**: FarmXChain  
**Contact**: Admin Dashboard for support

---

## 📊 Quick Reference

### Order Status Quick Guide
| Status | Description | Who Can Change | Next Status |
|--------|-------------|----------------|-------------|
| PENDING | Order placed | Farmer | ACCEPTED/REJECTED |
| ACCEPTED | Farmer confirmed | Farmer | ASSIGNED |
| REJECTED | Farmer declined | - | - |
| ASSIGNED | Distributor assigned | Farmer | IN_TRANSIT |
| IN_TRANSIT | Being shipped | Distributor | DELIVERED |
| DELIVERED | At buyer location | Distributor | COMPLETED |
| COMPLETED | Buyer confirmed | Buyer | - |
| CANCELLED | Order cancelled | Buyer/System | - |

### Shipment Status Quick Guide
| Status | Description | Action Required |
|--------|-------------|------------------|
| PICKED_UP | Goods collected from farm | Start transit |
| IN_TRANSIT | En route to destination | Update location/conditions |
| DELIVERED | At buyer address | Buyer confirms receipt |
| DELAYED | Shipment delayed | Resume or update ETA |
| CANCELLED | Shipment cancelled | - |

### User Role Capabilities
| Feature | Farmer | Distributor | Retailer | Consumer | Admin |
|---------|--------|-------------|----------|----------|-------|
| List Crops | ✅ | ❌ | ❌ | ❌ | ✅ (View) |
| Purchase Crops | ❌ | ✅ | ✅ | ✅ | ✅ (View) |
| Accept Orders | ✅ | ❌ | ❌ | ❌ | ✅ (View) |
| Assign Distributor | ✅ | ❌ | ❌ | ❌ | ✅ |
| Create Shipment | ❌ | ✅ | ❌ | ❌ | ✅ (View) |
| Track Shipment | ✅ | ✅ | ✅ | ✅ | ✅ |
| Confirm Delivery | ❌ | ✅ | ❌ | ❌ | ✅ (View) |
| Confirm Receipt | ❌ | ❌ | ✅ | ✅ | ✅ (View) |
| Verify Farmers | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ❌ | ✅ |
