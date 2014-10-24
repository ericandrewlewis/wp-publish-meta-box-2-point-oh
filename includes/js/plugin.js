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
				this.$el = $('.misc-pub-rad-publish-container');

				this.createDropdown();
				this.initializeDatepicker();

				this.$el.on( 'click', '.publish-action-update', _.bind( this.handleUpdateClick, this ) );
				this.$el.on( 'click', '.publish-action-publish-privately', _.bind( this.handlePublishPrivatelyClick, this ) );
				this.$el.on( 'click', '.publish-action-publish-publicly', _.bind( this.handlePublishPubliclyClick, this ) );
				this.$el.on( 'click', '.publish-action-preview', _.bind( this.handlePreviewClick, this ) );
				this.$el.on( 'click', '.publish-action-trash', _.bind( this.handleTrashClick, this ) );
				this.$el.on( 'click', '.publish-action-save-draft', _.bind( this.handleSaveDraftClick, this ) );
				this.$el.on( 'click', '.publish-action-save-as-pending-review', _.bind( this.handleSaveAsPendingReviewClick, this ) );
				this.$el.on( 'click', '.publish-action-publish-now', _.bind( this.handlePublishNowClick, this ) );
				this.$el.on( 'click', '.publish-action-show-schedule-interface', _.bind( this.handleShowScheduleInterfaceClick, this ) );
				this.$el.on( 'click', '.publish-action-schedule', _.bind( this.handleScheduleClick, this ) );
				this.$('.hour-dropdown,.ampm-dropdown,.minute-input').on( 'change keyup', _.bind( this.handleTimeInputsChange, this ) );
			},

			/**
			 * Create the Bootstrap dropdown and append it to #misc-publishing-actions.
			 */
			createDropdown: function() {
				if ( this.model.get( 'post_status' ) === 'publish' ) {
					this.publishingOptions = [
						{
							title: 'Update',
							slug: 'update'
						},
						{
							title: 'Publish privately',
							slug: 'publish-privately'
						},
						{
							title: 'Schedule',
							slug: 'show-schedule-interface'
						},
						{
							title: 'Preview changes',
							slug: 'preview'
						},
						{
							title: 'Trash',
							slug: 'trash'
						},
						{
							title: 'Send back to pending review',
							slug: 'save-as-pending-review'
						},
						{
							title: 'Send back to draft',
							slug: 'save-draft'
						}
					];
				}
				if ( this.model.get( 'post_status' ) === 'private' ) {
					this.publishingOptions = [
						{
							title: 'Update',
							slug: 'update'
						},
						{
							title: 'Publish publicly',
							slug: 'publish-publicly'
						},
						{
							title: 'Schedule',
							slug: 'show-schedule-interface'
						},
						{
							title: 'Preview changes',
							slug: 'preview'
						},
						{
							title: 'Trash',
							slug: 'trash'
						},
						{
							title: 'Send back to pending peview',
							slug: 'save-as-pending-review'
						},
						{
							title: 'Send back to draft',
							slug: 'save-draft'
						}
					];
				}
				if ( this.model.get( 'post_status' ) === 'future' ) {
					this.publishingOptions = [
						{
							title: 'Update',
							slug: 'update'
						},
						{
							title: 'Publish now',
							slug: 'publish-now'
						},
						{
							title: 'Schedule',
							slug: 'show-schedule-interface'
						},
						{
							title: 'Publish privately',
							slug: 'publish-privately'
						},
						{
							title: 'Preview changes',
							slug: 'preview'
						},
						{
							title: 'Trash',
							slug: 'trash'
						},
						{
							title: 'Send back to pending review',
							slug: 'save-as-pending-review'
						},
						{
							title: 'Send back to draft',
							slug: 'save-draft'
						}
					];
				}
				if ( _.contains( [ 'auto-draft', 'draft' ], this.model.get( 'post_status' ) ) ) {
					this.publishingOptions = [
						{
							title: 'Publish Now',
							slug: 'update'
						},
						{
							title: 'Publish privately',
							slug: 'publish-privately'
						},
						{
							title: 'Schedule',
							slug: 'show-schedule-interface'
						},
						{
							title: 'Save draft',
							slug: 'save-draft'
						},
						{
							title: 'Preview',
							slug: 'preview'
						},
						{
							title: 'Trash',
							slug: 'trash'
						},
						{
							title: 'Save as pending review',
							slug: 'save-as-pending-review'
						}
					];
				}
				if ( this.model.get( 'post_status' ) === 'pending' ) {
					this.publishingOptions = [
						{
							title: 'Update',
							slug: 'save-as-pending-review'
						},
						{
							title: 'Publish now',
							slug: 'publish-now'
						},
						{
							title: 'Schedule',
							slug: 'show-schedule-interface'
						},
						{
							title: 'Publish privately',
							slug: 'publish-privately'
						},
						{
							title: 'Send back to draft',
							slug: 'save-draft'
						},
						{
							title: 'Preview',
							slug: 'preview'
						},
						{
							title: 'Trash',
							slug: 'trash'
						}
					];
				}
				$dropdown = $( '<div class="misc-pub-section publish-button btn-group"></div>' );
				$dropdownUL = $( '<ul class="dropdown-menu" role="menu"></ul> ' );
				_.each( this.publishingOptions, function( element, index, list ) {
					if ( index === 0 ) {
						$dropdown.append( $('<button type="button" class="btn btn-primary publish-action-' + element.slug + '">' + element.title + '</button>' ),
							$( '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>' ) );
					} else {
						$dropdownUL.append( $( '<li><a href="#" class="publish-action-' + element.slug + '">' + element.title + '</a></li>' ) );
					}
				});
				$dropdown.append( $dropdownUL );
				$dropdown.insertAfter( '.rad-publish-status' );
			},

			handleUpdateClick: function() {
				event.preventDefault();
				$('#publish').simulate( 'click' );
			},

			handlePublishPrivatelyClick: function() {
				event.preventDefault();
				$('#post_status').val( 'publish' );
				$('[name="visibility"]').val( 'private' );
				$('#publish').simulate( 'click' );
			},

			handlePublishPubliclyClick: function() {
				event.preventDefault();
				$('#post_status').val( 'publish' );
				$('[name="visibility"]').val( 'public' );
				$('#publish').simulate( 'click' );
			},

			handlePreviewClick: function( event ) {
				event.preventDefault();
				event.stopPropagation();
				$('#post-preview').simulate( 'click' );
			},

			handleTrashClick: function( event ) {
				event.preventDefault();
				$('#delete-action a').simulate( 'click' );
			},

			handleSaveDraftClick: function() {
				event.preventDefault();
				$('[name="visibility"]').val( 'public' );
				$('#post_status').val( 'draft' );
				$('#save-post').simulate( 'click' );
			},

			handleSaveAsPendingReviewClick: function() {
				event.preventDefault();
				$('[name="visibility"]').val( 'public' );
				$('#post_status').val( 'pending' );
				if ( $('#save-post').length ) {
					$('#save-post').simulate( 'click' );
				} else {
					$('#publish').simulate( 'click' );
				}
			},

			handlePublishNowClick: function() {
				event.preventDefault();
				$('#publish').simulate( 'click' );
			},

			handleShowScheduleInterfaceClick: function() {
				event.preventDefault();
				this.$('.schedule').show();
			},

			initializeDatepicker: function() {
				$('.datepicker').datepicker({
					onSelect: function( dateString, datepickerInstance ) {
						var month = datepickerInstance.selectedMonth + 1;
						if ( month < 10 ) {
							month = '0' + month;
						}
						$('#mm [value="' + month + '"]').prop( 'selected', true );

						$('#jj').val( datepickerInstance.selectedDay );
						$('.save-timestamp').simulate('click');
					}
				});
			},

			handleTimeInputsChange: function( event ) {
				var hours = parseInt( this.$('.hour-dropdown').val() ),
					ampm = this.$('.ampm-dropdown').val(),
					minutes = this.$('.minute-input').val();
				if ( ampm === 'pm' ) {
					hours += 12;
				}
				$('#hh').val( hours );
				$('#mn').val( minutes );
				$('.save-timestamp').simulate('click');
			},

			handleScheduleClick: function() {
				$('#post_status').val( 'publish' );
				$('[name="visibility"]').val( 'public' );
				$('#publish').simulate( 'click' );
			}
		});

		new postStatusController();
	});
})( jQuery, Backbone, _ );