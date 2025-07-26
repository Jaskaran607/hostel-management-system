<?php 
include 'config.php';

$room_id = $_GET['room_id'] ?? 0;
$room = $pdo->query("SELECT r.*, h.name as hostel_name FROM rooms r JOIN hostels h ON r.hostel_id = h.id WHERE r.id = $room_id")->fetch();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Book Room <?php echo htmlspecialchars($room['room_number']); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h2>Book Room <?php echo htmlspecialchars($room['room_number']); ?> at <?php echo htmlspecialchars($room['hostel_name']); ?></h2>
        
        <form action="save_booking.php" method="post">
            <input type="hidden" name="room_id" value="<?php echo $room_id; ?>">
            
            <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="name" name="name" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="text" class="form-control" id="phone" name="phone" required>
            </div>
            <div class="mb-3">
                <label for="check_in_date" class="form-label">Check-in Date</label>
                <input type="date" class="form-control" id="check_in_date" name="check_in_date" required>
            </div>
            <div class="mb-3">
                <label for="duration" class="form-label">Duration (months)</label>
                <input type="number" class="form-control" id="duration" name="duration" min="1" value="1" required>
            </div>
            
            <button type="submit" class="btn btn-primary">Book Now</button>
        </form>
    </div>
</body>
</html>
