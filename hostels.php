<?php include 'config.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <title>Hostels List</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h2>Hostels List</h2>
        <?php if (isset($_GET['success'])): ?>
            <div class="alert alert-success"><?php echo htmlspecialchars($_GET['success']); ?></div>
        <?php endif; ?>
        
        <a href="add_hostel.php" class="btn btn-primary mb-3">Add New Hostel</a>
        
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $stmt = $pdo->query("SELECT * FROM hostels");
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    echo "<tr>
                            <td>{$row['id']}</td>
                            <td>{$row['name']}</td>
                            <td>{$row['address']}</td>
                            <td>{$row['contact']}</td>
                            <td>
                                <a href='view_hostel.php?id={$row['id']}' class='btn btn-info btn-sm'>View</a>
                                <a href='edit_hostel.php?id={$row['id']}' class='btn btn-warning btn-sm'>Edit</a>
                            </td>
                          </tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>
