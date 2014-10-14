(function( $, Backbone, _ ) {
	$(function() {
		var postStatusController = Backbone.View.extend({
			initialize: function() {
				this.model = new Backbone.Model( radPublishMetaBoxData );

				$container = $('<div class="misc-pub-section misc-pub-rad-publish-container"></div>' );
				var $select = this.$select = $('<select></select>' );
				if ( this.model.get( 'post_status' ) === 'publish' ) {
					$select.append( '<option value="publish">Published</option>' );
					$select.append( '<option value="private">Publish Privately</option>' );
				}
				if ( this.model.get( 'post_status' ) === 'private' ) {
					$select.append( '<option value="private">Privately Published</option>' );
					$select.append( '<option value="publish">Publish Publicly</option>' )
				}
				if ( this.model.get( 'post_status' ) === 'future' ) {
					$select.append( '<option value="future">Scheduled</option>' );
					$select.append( '<option value="publish">Publish Now</option>' );
					$select.append( '<option value="private">Publish Privately</option>' );
				}
				if ( _.contains( [ 'auto-draft', 'draft' ], this.model.get( 'post_status' ) ) ) {
					$select.append( '<option value="publish-now">Publish Now</option>' );
					$select.append( '<option value="schedule">Schedule</option>' );
				}
				$container.append( $select );
				$('#misc-publishing-actions').prepend( $container );
				this.$select.change( _.bind( this.handleSelectChange, this ) );

				// trigger immediately so proper elements are hidden/shown based on current status.
				this.handleSelectChange();
			},

			handleSelectChange: function() {
				var newMetaPostStatus = this.$select.val();
				if ( newMetaPostStatus === 'publish-now' ) {
					$('.misc-pub-curtime, .misc-pub-post-status, .misc-pub-visibility').hide();
				}
				if ( newMetaPostStatus === 'schedule' ) {
					$('.misc-pub-post-status, .misc-pub-visibility').hide();
					$('.misc-pub-curtime').show();
					$('#timestampdiv').show();
					$('.edit-timestamp').hide();
				}
			}
		});

		new postStatusController();
	});
})( jQuery, Backbone, _ );