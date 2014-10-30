(function( $, Backbone, _ ) {
	/**
	 * Ensure clicking buttons inside #submitpost don't trigger the submit event.
	 *
	 * See trac ticket #30035
	 */
	$(function() {
		$('#submitpost').find( ':button' ).on( 'click.edit-post', function( event ) {
			$('form#post').off( 'submit.edit-post' );
		});
	});

	$(function() {
		var postStatusController = Backbone.View.extend({

			/**
			 * Bind click actions from Bootstrap dropdown to handlers.
			 */
			initialize: function() {
				this.model = new Backbone.Model( window.radPublishMetaBoxData );
				this.initializeDatepicker();

				$('[name=pmb2-poststatus]').on( 'change', this.handlePostStatusChange );
				$('.pmb2-publish').on( 'click', _.bind( this.handleMajorPublishActionButtonClick, this ) );
				$('.pmb2-publish-action-preview').on( 'click', this.handlePreviewClick );
				$('.pmb2-password').on( 'keyup', this.syncPostPassword );
				// this.$('.hour-dropdown,.ampm-dropdown,.minute-input').on( 'change keyup', _.bind( this.handleTimeInputsChange, this ) );
			},

			initializeDatepicker: function() {
				$('.pmb2-datepicker').datepicker({
					onSelect: function( dateString, datepickerInstance ) {
						var month = datepickerInstance.selectedMonth + 1;
						if ( month < 10 ) {
							month = '0' + month;
						}
						$('#mm [value="' + month + '"]').prop( 'selected', true );
						$('#jj').val( datepickerInstance.selectedDay );
						$('#aa').val( datepickerInstance.selectedYear );
						$('.save-timestamp').simulate('click');
					}
				});
			},

			syncPostPassword: function() {
				$('[name=post_password]').val( $('.pmb2-password').val() );
			},

			/**
			 * When a new post status is selected, update
			 * the major publishing action button text.
			 */
			handlePostStatusChange: function() {
				var $this = $(this),
					$relatedLabel = $('[for=' + $this.attr('id') + ']'),
					newPostStatus = $(this).val();

				$('.pmb2-publish').html( $relatedLabel.html() );
				switch ( newPostStatus ) {
					case 'save-as-draft':
						$('[name="visibility"]').val( 'public' );
						$('#post_status').val( 'draft' );
					break;
					case 'send-to-pending-review':
						$('[name="visibility"]').val( 'public' );
						$('#post_status').val( 'pending' );
					break;
					case 'publish-now':
						$('#post_status').val( 'publish' );
						$('[name="visibility"]').val( 'public' );
						// @todo
					break;
					case 'schedule':
						$('#post_status').val( 'publish' );
						$('[name="visibility"]').val( 'public' );
					break;
					case 'publish-privately':
						$('#post_status').val( 'publish' );
						$('[name="visibility"]').val( 'private' );
					break;
					case 'publish-with-password-protection':
						$('#post_status').val( 'publish' );
						$('[name="visibility"]').val( 'password' );
					break;
					case 'move-to-trash':
						$('#delete-action a').simulate( 'click' );
					break;
				}
			},

			handleMajorPublishActionButtonClick: function() {
				var postStatus = $('[name=pmb2-poststatus]').val(),
					previousStatus = this.model.get('post_status');
				switch( postStatus ) {
					case 'publish-now':
					case 'schedule':
					case 'publish-privately':
						$('#publish').simulate( 'click' );
					break;
					case 'save-as-draft':
					case 'send-to-pending-review':
						$('#save-post').simulate( 'click' );
					break;
					case 'update':
						if ( previousStatus === 'draft' || previousStatus === 'pending' ) {
							$('#save-post').simulate( 'click' );
						} else {
						$('#publish').simulate( 'click' );
						}
					break;
				}
			}

			// handleTimeInputsChange: function( event ) {
			// 	var hours = parseInt( this.$('.hour-dropdown').val() ),
			// 		ampm = this.$('.ampm-dropdown').val(),
			// 		minutes = this.$('.minute-input').val();
			// 	if ( ampm === 'pm' ) {
			// 		hours += 12;
			// 	}
			// 	$('#hh').val( hours );
			// 	$('#mn').val( minutes );
			// 	$('.save-timestamp').simulate('click');
			// }
		});

		new postStatusController();
	});
})( jQuery, Backbone, _ );