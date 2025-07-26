<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Save resident first
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    
    $room_id = $_POST['room_id'];
    $check_in_date = $_POST['check_in_date'];
    $duration = $_POST['duration'];
    
    // Calculate check-out date (add months to check-in date)
    $check_out_date = date('Y-m-d', strtotime($check_in_date . " + $duration months"));
    
    try {
        $pdo->beginTransaction();
        
        // Check if resident exists
        $stmt = $pdo->prepare("SELECT id FROM residents WHERE email = ?");
        $stmt->execute([$email]);
        $resident = $stmt->fetch();
        
        if (!$resident) {
            // Create new resident
            $stmt = $pdo->prepare("INSERT INTO residents (name, email, phone) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $phone]);
            $resident_id = $pdo->lastInsertId();
        } else {
            $resident_id = $resident['id'];
        }
        
        // Create booking
        $stmt = $pdo->prepare("INSERT INTO bookings (resident_id, room_id, booking_date, check_in_date, check_out_date, status) 
                              VALUES (?, ?, CURDATE(), ?, ?, 'pending')");
        $stmt->execute([$resident_id, $room_id, $check_in_date, $check_out_date]);
        
        // Update room occupancy
        $stmt = $pdo->prepare("UPDATE rooms SET current_occupancy = current_occupancy + 1, status = 'occupied' WHERE id = ?");
        $stmt->execute([$room_id]);
        
        $pdo->commit();
        
        header("Location: booking_success.php?booking_id=" . $pdo->lastInsertId());
        exit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        die("Error: " . $e->getMessage());
    }
}
?>
