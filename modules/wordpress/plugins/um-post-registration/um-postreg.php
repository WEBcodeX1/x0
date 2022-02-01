<?php
/**
 * Plugin Name: Ultimate Member Post Registration Plugin
 * Plugin URI: http://www.webcodex.de
 * Description: Ultimate Member Registration Hook.
 * Version: 0.1
 * Author: Claus Prüfer
 * Author URI: http://www.webcodex.de
 */

add_action( 'um_registration_complete', 'my_post_registration', 10, 2 );

function my_post_registration( $user_id, $args ) {

	$request_header = array(
		'Content-Type: application/json'
	);

	$user_data = get_userdata( $user_id );
	$user_roles = $user_data->roles;
	$user_admin = (in_array('administrator', $user_roles)) ? '1' : '0';

	$request_json = '{ "RequestData": { "auth_key": "a2c3b2___//___ca23b2", "user_id": "'.$user_id.'", "user_admin": "'.$user_admin.'", "user_login": "'.$args['user_login'].'", "first_name": "'.$args['first_name'].'", "last_name": "'.$args['last_name'].'" } }';

	error_log($request_json);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	curl_setopt($ch, CURLOPT_STDERR, fopen('php://stderr', 'w'));
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $request_header);
	curl_setopt($ch, CURLOPT_URL,"https://external.de/python/UserRegister.py");
	curl_setopt($ch, CURLOPT_ENCODING, 'identity');
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $request_json);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$server_output = curl_exec($ch);
	curl_close ($ch);
}
?>
