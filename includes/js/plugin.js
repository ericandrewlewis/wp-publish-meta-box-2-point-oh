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
				var self = this;
				this.previousPostDetails = new Backbone.Model( window.radPublishMetaBoxData.post );
				this.currentTime = new Date( window.radPublishMetaBoxData.currentTime );
				this.overrideAction = '';
				this.initializeDatepicker();

				$('[name=pmb2-poststatus]').on( 'change', _.bind( this.handlePostStatusChange, this ) );
				$('.pmb2-publish').on( 'click', _.bind( this.handleMajorPublishActionButtonClick, this ) );
				$('.pmb2-publish-action-preview').on( 'click', this.handlePreviewClick );
				$('.pmb2-password').on( 'keyup', this.syncPostPassword );
				$('.pmb2-hour-dropdown').on( 'change', this.syncHourInput );
				$('.pmb2-minute').on( 'keyup', this.syncMinuteInput );
				$('#pmb2-publish-at-date').on( 'click', function() {
					$('.pmb2-publish-at-date-inner').show();
				});
				$('[name=pmb2-publish-when]').on( 'change', function() {
					$('.pmb2-publish').removeClass( 'disabled' );
					$input = $(this);
					if ( $input.val() == 'now' ) {
						$('.pmb2-publish').html( 'Publish Now' );
						self.subaction = 'publish-now';
						$('.pmb2-publish-at-date-inner').hide();
					} else if ( $input.val() == 'publish-at-date' ) {
						$('.pmb2-publish').html( 'Schedule' );
						self.subaction = 'publish-at-date';
						$('.pmb2-publish-at-date-inner').show();
					}
				});
			},

			setPostDate: function( dateInfo ) {
				var dateMap = {
					year:   $('#aa'),
					month:  $('#mm'),
					day:    $('#jj'),
					hour:   $('#hh'),
					minute: $('#mn')
				};

				if ( dateInfo.month && dateInfo.month < 10 ) {
					dateInfo.month = '0' + dateInfo.month;
				}
				if ( dateInfo.minute && dateInfo.minute < 10 ) {
					dateInfo.minute = '0' + dateInfo.minute;
				}
				_.each( dateInfo, function( element, index, list ) {
					if ( ! dateMap.hasOwnProperty( index ) ) {
						return;
					}
					dateMap[index].val( element );
				});
			},

			/**
			 * Initialize the Scheduling jQuery UI Datepicker.
			 */
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

			handlePreviewClick: function( event ) {
				event.preventDefault();
				event.stopPropagation();
				$('#post-preview').simulate( 'click' );
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
				$('.pmb2-publish-inner').hide();
				$('.pmb2-publish').removeClass( 'disabled' );
				this.overrideAction = '';
				switch ( newPostStatus ) {
					case 'save-as-draft':
						$('[name="visibility"]').val( 'public' );
						$('#post_status').val( 'draft' );
					break;
					case 'send-to-pending-review':
						$('[name="visibility"]').val( 'public' );
						$('#post_status').val( 'pending' );
					break;
					case 'publish':
						$('.pmb2-publish-inner').show();
						if ( ! $('[name=pmb2-publish-when]:checked').val() ) {
							$('.pmb2-publish').addClass( 'disabled' );
						}
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
						this.overrideAction = 'trash';
					break;
				}
			},

			/**
			 * When the Major publishing action button is clicked,
			 * do some under-the-hood business to make sure the
			 * intended action is done.
			 *
			 * @param  jQuery.Event event
			 */
			handleMajorPublishActionButtonClick: function( event ) {
				var postStatus = $('[name=pmb2-poststatus]:checked').val(),
					previousStatus = this.previousPostDetails.get('post_status');

				if ( $('.pmb2-publish').hasClass( 'disabled' ) ) {
					return;
				}
				if ( this.overrideAction == 'trash' ) {
					$('#delete-action a').simulate( 'click' );
					var $submitpost = $('#submitpost');
					$submitpost.find('#major-publishing-actions .spinner').show();
					$submitpost.find( ':button, :submit, a.submitdelete, #post-preview' )
						.addClass( 'disabled' );
					return;
				}
				switch( postStatus ) {
					case 'publish':
						if ( this.subaction == 'publish-at-date' ) {
							var date = new Date( $('.pmb2-datepicker').datepicker( 'getDate' ) );
							this.setPostDate({
								year: date.getFullYear(),
								month: date.getMonth() + 1,
								day: date.getDate(),
								hour: $('.pmb2-hour-dropdown').val(),
								minute: $('.pmb2-minute').val()
							});
						} else if ( this.subaction == 'publish-now' ) {
							this.setPostDate({
								year:   this.currentTime.getFullYear(),
								month:  this.currentTime.getMonth() + 1,
								day:    this.currentTime.getDate(),
								hour:   this.currentTime.getHours(),
								minute: this.currentTime.getMinutes()
							});
						}
					case 'schedule':
					case 'publish-privately':
						$('#publish').simulate( 'click' );
					break;
					case 'save-as-draft':
					case 'send-to-pending-review':
						if ( $('#save-post').length ) {
							$('#save-post').simulate( 'click' );
						} else {
							$('#publish').simulate( 'click' );
						}
					break;
					case 'update':
						if ( previousStatus === 'draft' || previousStatus === 'pending' ) {
							$('#save-post').simulate( 'click' );
						} else {
						$('#publish').simulate( 'click' );
						}
					break;
				}
			},

			syncHourInput: function() {
				$dropdown = $(this);
				$('#hh').val( $dropdown.val() );
			},

			syncMinuteInput: function() {
				$input = $(this);
				$('#mn').val( $input.val() );
			}
		});

		new postStatusController();
	});
})( jQuery, Backbone, _ );