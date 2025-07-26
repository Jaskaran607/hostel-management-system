<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $address = $_POST['address'];
    $contact = $_POST['contact'];
    $description = $_POST['description'];

    try {
        $stmt = $pdo->prepare("INSERT INTO hostels (name, address, contact, description) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $address, $contact, $description]);
        
        header("Location: hostels.php?success=Hostel added successfully");
        exit();
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
}
?>
