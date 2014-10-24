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
	wp_enqueue_script( 'bootstrap', plugins_url( 'includes/js/bootstrap.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_style( 'jquery-ui-css', plugins_url( 'includes/jquery-ui/jquery-ui.css', __FILE__ ) );

	wp_register_script( 'jquery-simulate', plugins_url( 'includes/js/jquery.simulate.js', __FILE__ ), array( 'jquery' ) );

	wp_enqueue_script( 'publish-meta-box-two-point-oh-js',
		plugins_url( 'includes/js/plugin.js', __FILE__ ),
		array( 'jquery', 'jquery-simulate', 'backbone', 'post', 'jquery-ui-datepicker' ) );
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
		case 'future':
			$message = sprintf( "Scheduled to publish on %s %s",
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
	?><div class="misc-pub-rad-publish-container">
		<div class="misc-pub-section rad-publish-status">Status: <?php echo $message ?></div>
		<div class="schedule">
			<div class="misc-pub-section datepicker"></div>
			<div class="misc-pub-section publish-button"></div>
			<div class="misc-pub-section time-inputs">
				<select class="hour-dropdown">
					<?php for( $i = 0; $i <= 11; $i++ ) :
						if ( $i == 0 ) {
							$hour = 12;
						} else {
							$hour = $i;
						}

						?><option value="<?php echo $hour ?>"  <?php selected( get_post_time( 'g', false, $post->ID ), $hour ) ?>><?php echo $hour ?></option>
					<?php endfor; ?>
				</select>:<input class="minute-input" maxlength="2" size="2" value="<?php echo get_post_time( 'i', false, $post->ID ) ?>">
				<select class="ampm-dropdown">
					<option value="am" <?php selected( get_post_time( 'a', false, $post->ID ), 'am' ) ?>>am</option>
					<option value="pm" <?php selected( get_post_time( 'a', false, $post->ID ), 'pm' ) ?>>pm</option>
				</select>
			</div>
			<div class="misc-pub-section schedule-button">
				<button type="button" class="button button-primary publish-action-schedule">Schedule</button>
			</div>
		</div>
	</div><?php

} );