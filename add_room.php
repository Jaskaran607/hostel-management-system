<?php 
include 'config.php';

// Get hostel ID from URL
$hostel_id = $_GET['hostel_id'] ?? 0;
$hostel = $pdo->query("SELECT name FROM hostels WHERE id = $hostel_id")->fetch();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Add Room</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h2>Add Room to <?php echo htmlspecialchars($hostel['name']); ?></h2>
        <form action="save_room.php" method="post">
            <input type="hidden" name="hostel_id" value="<?php echo $hostel_id; ?>">
            
            <div class="mb-3">
                <label for="room_number" class="form-label">Room Number</label>
                <input type="text" class="form-control" id="room_number" name="room_number" required>
            </div>
            <div class="mb-3">
                <label for="capacity" class="form-label">Capacity</label>
                <input type="number" class="form-control" id="capacity" name="capacity" min="1" required>
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">Price (per month)</label>
                <input type="number" step="0.01" class="form-control" id="price" name="price" required>
            </div>
            <button type="submit" class="btn btn-primary">Save Room</button>
        </form>
    </div>
</body>
</html>
