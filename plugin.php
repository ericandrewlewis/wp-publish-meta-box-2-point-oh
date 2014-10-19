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
	wp_enqueue_style( 'publish-meta-box-two-point-oh', plugins_url( 'includes/css/plugin.css', __FILE__ ) );
	// wp_enqueue_style( 'bootstrap', '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css' );
	wp_enqueue_script( 'bootstrap', '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js', array( 'jquery' ) );

	wp_register_script( 'jquery-simulate', plugins_url( 'includes/js/jquery.simulate.js', __FILE__ ), array( 'jquery' ) );

	wp_enqueue_script( 'publish-meta-box-two-point-oh-js', plugins_url( 'includes/js/plugin.js', __FILE__ ), array( 'jquery', 'jquery-simulate', 'backbone', 'post' ) );
	$wp_scripts->add_data( 'publish-meta-box-two-point-oh-js', 'data',
		'radPublishMetaBoxData = ' . json_encode( $post ) );
});

add_action( 'post_submitbox_misc_actions', function() {
	global $post_ID, $post;
	switch( $post->post_status ) {
		case 'publish':
			$message = sprintf( "Published on %s %s",
				get_the_date( '', $post ), get_the_time( '', $post ) );
		break;
		case 'private':
			$message = 'Privately Published';
		break;
		case 'auto-draft':
			$message = 'Auto draft';
		break;
		case 'draft':
			$message = 'Draft';
		break;
		case 'pending':
			$message = 'Pending Review';
		break;
	}
	printf( "<div class='misc-pub-section'>Status: %s</div>", $message );

} );