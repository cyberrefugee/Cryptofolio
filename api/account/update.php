<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT");
	header("Content-Type: application/json");

	if($_SERVER["REQUEST_METHOD"] == "PUT") {
		$input = json_decode(file_get_contents("php://input"), true);

		$utils = require_once("../utils.php");
		$helper = new Utils();

		$currentPassword = !empty($input["currentPassword"]) ? $input["currentPassword"] : die();
		$newPassword = !empty($input["newPassword"]) ? $input["newPassword"] : die();

		if($helper->verifyPassword($currentPassword)) {
			$current = json_decode(file_get_contents($helper->accountFile), true);
		
			$current["password"] = password_hash($newPassword, PASSWORD_DEFAULT);

			$helper->generateToken("web");
			$helper->generateToken("app");
			$helper->generateToken("desktop");

			$update = file_put_contents($helper->accountFile, json_encode($current));

			if($update) {
				echo json_encode(array("message" => "Account password has been changed."));
			} else {
				echo json_encode(array("error" => "Password couldn't be changed."));
			}
		} else {
			echo json_encode(array("error" => "Invalid password.", "valid" => false));
		}
	} else {
		echo json_encode(array("error" => "Wrong request method. Please use PUT."));
	}
?>