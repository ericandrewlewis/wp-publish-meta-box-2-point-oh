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
	?>
	<div class="pmb2">
		<div class="misc-pub-section">Current status: <?php echo $message ?></div>
		<div class="misc-pub-section">
			<?php if ( $post->post_status === 'auto-draft' ) : ?>
			<input type="radio" id="pmb2-poststatus-save-as-draft" name="pmb2-poststatus" value="save-as-draft" checked>
			<label for="pmb2-poststatus-save-as-draft" class="pmb2-poststatus-label">Save as draft</label><br>
			<?php else : ?>
			<input type="radio" id="pmb2-poststatus-update" name="pmb2-poststatus" value="update" checked>
			<label for="pmb2-poststatus-update" class="pmb2-poststatus-label">Update</label><br>
			<?php if ( $post->post_status !== 'draft' ) : ?>
			<input type="radio" id="pmb2-poststatus-save-as-draft" name="pmb2-poststatus" value="save-as-draft">
			<label for="pmb2-poststatus-save-as-draft" class="pmb2-poststatus-label">Send back to draft</label><br>
			<?php endif; ?>
			<?php endif; ?>
			<?php if ( $post->post_status !== 'pending' ) : ?>
			<input type="radio" id="pmb2-poststatus-send-back-to-pending-review" name="pmb2-poststatus" value="send-to-pending-review">
			<label for="pmb2-poststatus-send-back-to-pending-review" class="pmb2-poststatus-label">Send to pending review</label><br>
			<?php endif; ?>
			<input type="radio" id="pmb2-poststatus-publish" name="pmb2-poststatus" value="publish-now">
			<label for="pmb2-poststatus-publish" class="pmb2-poststatus-label">Publish now</label><br>
			<input type="radio" id="pmb2-poststatus-schedule" name="pmb2-poststatus" value="schedule">
			<label for="pmb2-poststatus-schedule" class="pmb2-poststatus-label">Schedule</label><br>
			<div class="misc-pub-section">
				<div class="dashicons dashicons-calendar-alt"></div>
				<input type="text" class="pmb2-datepicker" value="<?php esc_attr_e( get_the_time( 'm/d/Y' ) ) ?>">
				<div class="dashicons dashicons-clock"></div>
				<input type="text" class="pmb2-clock" value="<?php esc_attr_e( get_the_time( 'H:m' ) ) ?>">
			</div>
			<input type="radio" id="pmb2-poststatus-publish-privately" name="pmb2-poststatus" value="publish-privately">
			<label for="pmb2-poststatus-publish-privately" class="pmb2-poststatus-label">Publish Privately</label><br>
			<input type="radio" id="pmb2-poststatus-move-to-trash" name="pmb2-poststatus" value="move-to-trash">
			<label for="pmb2-poststatus-move-to-trash" class="pmb2-poststatus-label">Move to trash</label><br>
			<div class="misc-pub-section">
				<input type="text" placeholder="post password" class="pmb2-password" value="<?php esc_attr_e( $post->post_password ) ?>">
			</div>
		</div>
		<div id="major-publishing-actions">
			<div id="preview-action">
				<button type="button" class="button button-large dashicons-before dashicons-search pmb2-publish-action-preview">Preview</button>
			</div>
			<div id="publishing-action">
				<span class="spinner"></span>
				<input name="original_publish" type="hidden" id="original_publish" value="Publish">
				<button type="button" name="pmb2-publish" class="pmb2-publish button button-primary button-large">
					<?php if ( $post->post_status === 'auto-draft' ) : ?>
					Save as draft
					<?php else : ?>
					Update
					<?php endif; ?>
				</button>
			</div>
			<div class="clear"></div>
		</div>
	</div>
	<?php
} );