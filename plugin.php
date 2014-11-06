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
	$data = array(
		'post' => $post,
		'currentTime' => current_time( 'mysql' )
	);
	$wp_scripts->add_data( 'publish-meta-box-two-point-oh-js', 'data',
		'radPublishMetaBoxData = ' . json_encode( $data ) );
});

add_action( 'post_submitbox_misc_actions', function() {
	global $post_ID, $post;
	switch( $post->post_status ) {
		case 'publish':
			$message = sprintf( "Published on %s %s",
				get_the_date( '', $post ), get_the_time( '', $post ) );
		break;
		case 'future':
			$message = sprintf( "Scheduled to publish on %s at %s",
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

	$now = new DateTime( current_time( 'mysql' ) ); ?>
	<div class="pmb2">
		<div class="misc-pub-section" style="overflow: hidden">
			<div id="preview-action">
				<button type="button" class="button button-large dashicons-before dashicons-search pmb2-publish-action-preview">Preview</button>
			</div>
		</div>
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
			<input type="radio" id="pmb2-poststatus-publish" name="pmb2-poststatus" value="publish">
			<label for="pmb2-poststatus-publish" class="pmb2-poststatus-label">Publish</label><br>
			<div class="misc-pub-section pmb2-publish-inner">
				<input type="radio" id="pmb2-publish-now" name="pmb2-publish-when" value="now">
				<label for="pmb2-publish-now" class="pmb2-poststatus-label">Now</label><br>
				<input type="radio" id="pmb2-publish-at-date" name="pmb2-publish-when" value="publish-at-date">
				<label for="pmb2-publish-at-date" class="pmb2-poststatus-label">At date...</label><br>
				<div class="misc-pub-section pmb2-publish-at-date-inner">
					<div class="dashicons dashicons-calendar-alt"></div>
					<input type="text" class="pmb2-datepicker" value="<?php esc_attr_e( $now->format( 'm/d/Y' ) ) ?>">
					<br>
					<div class="dashicons dashicons-clock"></div>
					<select class="pmb2-hour-dropdown">
						<?php $hours = array( '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
							'13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ); ?>
						<?php foreach ( $hours as $hour ) : ?>
						<option <?php selected( $now->format( 'H' ), $hour ) ?> value="<?php echo $hour ?>"><?php echo $hour ?></option>
						<?php endforeach; ?>
					</select>:
					<input type="text" class="pmb2-minute" value="<?php esc_attr_e( $now->format( 'i' ) ) ?>">
				</div>
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