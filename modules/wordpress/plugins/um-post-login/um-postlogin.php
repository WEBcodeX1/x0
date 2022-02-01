<?php
/**
 * Plugin Name: Ultimate Member Post Login Plugin
 * Plugin URI: http://www.webcodex.de
 * Description: Ultimate Member Login Hook.
 * Version: 0.1
 * Author: Claus Prüfer
 * Author URI: http://www.webcodex.de
 */
add_action('set_logged_in_cookie', 'my_login_function', 10, 6);

function my_login_function( $logged_in_cookie, $expire, $expiration, $user_id, $logged_in_text, $token ) {

	$request_header = array(
		'Content-Type: application/json'
	);

	$request_json = '{"RequestData": { "auth_key": "cdba23___X//X___baf234", "user_id": "'.$user_id.'", "session_id": "'.$token.'" } }';

	error_log($request_json);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	curl_setopt($ch, CURLOPT_STDERR, fopen('php://stderr', 'w'));
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $request_header);
	curl_setopt($ch, CURLOPT_URL,"https://external.de/python/UserLogin.py");
	curl_setopt($ch, CURLOPT_ENCODING, 'identity');
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$server_output = curl_exec($ch);
	error_log($server_output);
	curl_close ($ch);
}
?>
