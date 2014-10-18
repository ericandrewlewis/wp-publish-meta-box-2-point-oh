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
	// wp_enqueue_style( 'bootstrap', '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css' );
	wp_enqueue_script( 'bootstrap', '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js', array( 'jquery' ) );

	wp_enqueue_script( 'rad-publish-meta-box-js', plugins_url( 'includes/js/plugin.js', __FILE__ ), array( 'jquery', 'backbone' ) );
	$wp_scripts->add_data( 'rad-publish-meta-box-js', 'data',
		'radPublishMetaBoxData = ' . json_encode( $post ) );
// <!-- Optional theme -->
// <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">

// <!-- Latest compiled and minified JavaScript -->
// <script src="https:"></script>
// Install with Bower
});

add_action( 'post_submitbox_misc_actions', function() {
	global $post;
	switch( $post->post_status ) {
		case 'publish':
			$message = sprintf( "Published on %s %s",
				get_the_date( '', $post ), get_the_time( '', $post ) );
		break;
		case 'private':
			$message = 'Privately Published';
		break;
	}
	printf( "<div class='misc-pub-section'>%s</div>", $message );

} );