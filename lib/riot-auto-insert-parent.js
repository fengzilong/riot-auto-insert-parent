/*
 * riot-auto-insert-parent
 * https://github.com/fengzilong/riot-auto-insert-parent
 *
 * Copyright (c) 2015 fengzilong
 * Licensed under the MIT license.
 */

var CompositeDisposable = require('atom').CompositeDisposable;

module.exports = {
	subscriptions: null,
	activate: function( state ){
		var self = this;
		this.subscriptions = new CompositeDisposable();
		this.subscriptions.add(
			atom.commands.add(
				'atom-workspace',
				{
					'riot-auto-insert-parent:insert': function(){
						return self.insert();
					}
				}
			)
		)
	},
	insert: function(){
		var editor = atom.workspace.getActiveTextEditor();

		var cursorPos = editor.getCursorBufferPosition();

		var rangeToCursor = [ [0, 0], cursorPos ];

		var tagOpenCount = 0;
		var tagCloseCount = 0;

		editor.backwardsScanInBufferRange(/<([-\w]+)\s*([^"'\/>]*(?:(?:"[^"]*"|'[^']*'|\/[^>])[^'"\/>]*)*)>/g, rangeToCursor, function( result ){
			if( ~result.match[ 1 ].indexOf( '-' ) ){
				tagOpenCount++;
			}
		});

		editor.backwardsScanInBufferRange(/<\/([-\w]+)>/g, rangeToCursor, function( result ){
			if( ~result.match[ 1 ].indexOf( '-' ) ){
				tagCloseCount++;
			}
		});

		editor.insertText( 'parent.'.repeat( tagOpenCount - tagCloseCount - 1 ) )
	},
	deactivate: function(){},
	serialize: function(){}
};