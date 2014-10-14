<?php
/**
 * Plugin Name: WP Publish Meta Box 2.0
 * Author: ericandrewlewis
 */

add_action( 'admin_enqueue_scripts', function() {
	global $wp_scripts, $post;
	$whitelisted_pages = array( 'post.php', 'post-new.php' );
	if ( ! in_array( $GLOBALS['hook_suffix'], $whitelisted_pages ) ) {
		return;
	}
	wp_enqueue_style( 'rad-publish-meta-box', plugins_url( 'includes/css/plugin.css', __FILE__ ) );
	wp_enqueue_script( 'rad-publish-meta-box', plugins_url( 'includes/js/plugin.js', __FILE__ ), array( 'jquery', 'select2', 'backbone' ) );
	$wp_scripts->add_data( 'rad-publish-meta-box', 'data',
		'radPublishMetaBoxData = ' . json_encode( $post ) );
});