CREATE DATABASE hostel_management;
USE hostel_management;

-- Hostels table
CREATE TABLE hostels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    contact VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    FOREIGN KEY (hostel_id) REFERENCES hostels(id)
);

-- Students/Residents table
CREATE TABLE residents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,
    room_id INT NOT NULL,
    booking_date DATE NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('paid', 'unpaid', 'partial') DEFAULT 'unpaid',
    amount_paid DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (resident_id) REFERENCES residents(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
