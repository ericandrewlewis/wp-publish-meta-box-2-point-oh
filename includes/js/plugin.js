(function( $, Backbone, _ ) {
	$(function() {
		var postStatusController = Backbone.View.extend({
			initialize: function() {
				this.model = new Backbone.Model( radPublishMetaBoxData );
				this.createDropdown();
				this.$el.on( 'click', '.publish-action-update', _.bind( this.handleUpdateClick, this ) );
				this.$el.on( 'click', '.publish-action-publish-privately', _.bind( this.handlePublishPrivatelyClick, this ) );
				this.$el.on( 'click', '.publish-action-publish-publicly', _.bind( this.handlePublishPubliclyClick, this ) );
				this.$el.on( 'click', '.publish-action-preview', _.bind( this.handlePreviewClick, this ) );
				this.$el.on( 'click', '.publish-action-trash', _.bind( this.handleTrashClick, this ) );
				this.$el.on( 'click', '.publish-action-save-draft', _.bind( this.handleSaveDraftClick, this ) );

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
						},
						{
							title: 'Preview Changes',
							slug: 'preview'
						},
						{
							title: 'Trash',
							slug: 'trash'
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
						},
						{
							title: 'Preview Changes',
							slug: 'preview'
						},
						{
							title: 'Trash',
							slug: 'trash'
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
						},
						{
							title: 'Preview Changes',
							slug: 'preview'
						},
						{
							title: 'Trash',
							slug: 'trash'
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
							title: 'Save Draft',
							slug: 'save-draft'
						},
						{
							title: 'Publish Privately',
							slug: 'publish-privately'
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
				$('#post-preview').simulate( 'click' );
			},

			handleTrashClick: function( event ) {
				event.preventDefault();
				$('#delete-action a').simulate( 'click' );
			},

			handleSaveDraftClick: function() {
				event.preventDefault();
				$('#save-post').simulate( 'click' );
			}
		});

		new postStatusController();
	});
})( jQuery, Backbone, _ );