(function( $, Backbone, _ ) {
	$(function() {
		var postStatusController = Backbone.View.extend({
			initialize: function() {
				this.model = new Backbone.Model( radPublishMetaBoxData );
				this.createDropdown();
				this.$el.on( 'click', '.publish-action-update', _.bind( this.handleUpdateClick, this ) );
				this.$el.on( 'click', '.publish-action-publish-privately', _.bind( this.handlePublishPrivatelyClick, this ) );
				this.$el.on( 'click', '.publish-action-publish-publicly', _.bind( this.handlePublishPubliclyClick, this ) );

			},

			createDropdown: function() {
				this.$el = $('<div class="misc-pub-section misc-pub-rad-publish-container"></div>' );
				if ( this.model.get( 'post_status' ) === 'publish' ) {
					this.publishingOptions = [
						{
							title: 'Update',
							slug: 'update'
						},
						{
							title: 'Publish Privately',
							slug: 'publish-privately'
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
							title: 'Publish Publicly',
							slug: 'publish-publicly'
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
							title: 'Publish Now',
							slug: 'publish-now'
						},
						{
							title: 'Publish Privately',
							slug: 'publish-privately'
						}

					];
				}
				if ( _.contains( [ 'auto-draft', 'draft' ], this.model.get( 'post_status' ) ) ) {
					this.publishingOptions = [
						{
							title: 'Publish Now',
							slug: 'publish'
						},
						{
							title: 'Schedule',
							slug: 'schedule'
						}

					];
				}
				$dropdown = $( '<div class="btn-group"></div>' );
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
				this.$el.append( $dropdown );
				$('#misc-publishing-actions').append( this.$el );
			},

			handleUpdateClick: function() {
				$('#publish').trigger( 'click' );
			},

			handlePublishPrivatelyClick: function() {
				$('#post_status').val( 'publish' );
				$('[name="visibility"]').val( 'private' );
				$('#publish').trigger( 'click' );
			},

			handlePublishPubliclyClick: function() {
				$('#post_status').val( 'publish' );
				$('[name="visibility"]').val( 'public' );
				$('#publish').trigger( 'click' );
			}
		});

		new postStatusController();
	});
})( jQuery, Backbone, _ );