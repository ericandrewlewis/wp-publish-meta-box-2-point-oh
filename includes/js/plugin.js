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
				this.previousPostDetails = new Backbone.Model( window.radPublishMetaBoxData );
				this.overrideAction = '';
				this.initializeDatepicker();

				$('[name=pmb2-poststatus]').on( 'change', _.bind( this.handlePostStatusChange, this ) );
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
			handlePostStatusChange: function( event ) {
				var $input = $(event.currentTarget),
					$relatedLabel = $('[for=' + $input.attr('id') + ']'),
					newPostStatus = $input.val();

				$('.pmb2-publish').html( $relatedLabel.html() );
				switch ( newPostStatus ) {
					case 'save-as-draft':
						this.overrideAction = '';
						$('[name="visibility"]').val( 'public' );
						$('#post_status').val( 'draft' );
					break;
					case 'send-to-pending-review':
						this.overrideAction = '';
						$('[name="visibility"]').val( 'public' );
						$('#post_status').val( 'pending' );
					break;
					case 'publish-now':
						this.overrideAction = '';
						$('#post_status').val( 'publish' );
						$('[name="visibility"]').val( 'public' );
						// @todo
					break;
					case 'schedule':
						this.overrideAction = '';
						$('#post_status').val( 'publish' );
						$('[name="visibility"]').val( 'public' );
					break;
					case 'publish-privately':
						this.overrideAction = '';
						$('#post_status').val( 'publish' );
						$('[name="visibility"]').val( 'private' );
					break;
					case 'publish-with-password-protection':
						this.overrideAction = '';
						$('#post_status').val( 'publish' );
						$('[name="visibility"]').val( 'password' );
					break;
					case 'move-to-trash':
						this.overrideAction = 'trash';
					break;
				}
			},

			handleMajorPublishActionButtonClick: function( event ) {
				var postStatus = $('[name=pmb2-poststatus]').val(),
					previousStatus = this.previousPostDetails.get('post_status');
				if ( this.overrideAction == 'trash' ) {
					$('#delete-action a').simulate( 'click' );
					return;
				}
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
		});

		new postStatusController();
	});
})( jQuery, Backbone, _ );