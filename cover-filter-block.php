<?php
/**
 * Plugin Name:       Cover Filter Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cover-filter-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_cover_filter_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_cover_filter_block_block_init' );

// Hook into `wp_enqueue_scripts` to enqueue the custom script
add_action( 'wp_enqueue_scripts', 'enqueue_my_custom_script' );

function enqueue_my_custom_script() {
	wp_enqueue_script( 
		'cover-filter-block-view', 
		plugin_dir_url( __FILE__ ) . '/build/view.js', 
		array(), '1.0', 
		true );

}
