// Import necessary functions and components from WordPress packages
import { addFilter } from '@wordpress/hooks'; // Allows adding filters to modify block behavior
import { createHigherOrderComponent } from '@wordpress/compose'; // Allows creating higher-order components (HOCs)
import { InspectorControls } from '@wordpress/block-editor'; // Provides control UI for block editing
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components'; // UI components for block settings
import { Fragment } from '@wordpress/element'; // A wrapper to group multiple elements without adding extra nodes to the DOM
import React from 'react'; // Import React for JSX and cloneElement usage

/**
 * @see {@link https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype}
 * Filter hook used to modify block settings during block registration.
 */
export const hook = 'blocks.registerBlockType';

/**
 * Name of the filter, used as a unique identifier.
 */
export const name = 'sage/cover';

/**
 * Filter callback function to modify the block's settings.
 *
 * @param {Object} settings Block settings.
 * @param {string} name Block name.
 * @returns Modified settings with new attributes added.
 */
export function callback(settings, name) {
  // Only modify settings for the 'core/cover' block
  if (name !== 'core/cover') return settings;

  // Use the spread operator to preserve existing settings and add new attributes
  return {
    ...settings, // Retain all existing settings
    attributes: {
      ...settings.attributes, // Retain all existing attributes
      loopVideo: {
        type: 'boolean',
        default: false,
      },
      autoplayVideo: {
        type: 'boolean',
        default: false,
      },
      showPlayButton: {
        type: 'boolean',
        default: true,
      },
      coverImage: {
        type: 'string',
        default: '',
      },
    },
  };
}

/**
 * Hook used to modify the block's edit component.
 */
export const editHook = 'editor.BlockEdit';

/**
 * Higher-order component (HOC) to modify the block's edit function.
 */
export const editCallback = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    const { attributes, setAttributes, name } = props;

    // Only apply modifications to the 'core/cover' block
    if (name !== 'core/cover') {
      return <BlockEdit {...props} />;
    }

    const { loopVideo, autoplayVideo, showPlayButton, coverImage } = attributes;

    // Render the modified block editor interface with additional controls
    return (
      <Fragment>
        {/* Render the original BlockEdit component */}
        <BlockEdit {...props} />
        {/* Add custom controls to the block's inspector panel */}
        <InspectorControls>
          <PanelBody title="Video Options" initialOpen={true}>
            {/* Toggle control for looping the video */}
            <ToggleControl
              label="Loop Video"
              checked={loopVideo}
              onChange={(value) => setAttributes({ loopVideo: value })}
            />
            {/* Toggle control for autoplaying the video */}
            <ToggleControl
              label="Autoplay Video"
              checked={autoplayVideo}
              onChange={(value) => setAttributes({ autoplayVideo: value })}
            />
            {/* Toggle control for showing the play button */}
            <ToggleControl
              label="Show Play Button"
              checked={showPlayButton}
              onChange={(value) => setAttributes({ showPlayButton: value })}
            />
            {/* Text control for setting the cover image URL */}
            <TextControl
              label="Cover Image URL"
              value={coverImage}
              onChange={(value) => setAttributes({ coverImage: value })}
              help="This image will be used as the cover image for the video."
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  };
}, 'withCoverControls');

/**
 * Hook used to modify the block's save element.
 */
export const saveHook = 'blocks.getSaveElement';

/**
 * Callback function to modify the save output of the block.
 *
 * @param {Object} element The element to be saved.
 * @param {Object} blockType The block type object.
 * @param {Object} attributes The block attributes.
 * @returns Modified element with custom attributes applied.
 */
export const saveCallback = (element, blockType, attributes) => {
  // Only modify the save output for the 'core/cover' block
  if (blockType.name !== 'core/cover') return element;

  const { loopVideo, autoplayVideo, showPlayButton, coverImage } = attributes;

  // Ensure children elements are processed correctly, filtering out null/undefined elements
  const children = Array.isArray(element.props.children) ? element.props.children.filter(Boolean) : [];
  console.log('Filtered Children:', children);

  // Map over the children to modify any video elements with the specified attributes
  const modifiedChildren = children.map((child) => {
    console.log('Processing Child:', child);
    if (child && child.type === 'video') {
      // Clone the video element and apply the new attributes
      return React.cloneElement(child, {
        loop: loopVideo,
        autoPlay: autoplayVideo,
        poster: coverImage || child.props.poster,
      });
    }
    return child;
  });

  console.log('Modified Children:', modifiedChildren);

  // Return the modified element with the custom video attributes and play button overlay
  return (
    <div {...element.props}>
      {modifiedChildren}
      {showPlayButton && (
        <div className="wp-block-cover__play-button-overlay" style={{ position: 'absolute', zIndex: 10 }}>
          <button className="wp-block-cover__play-button" aria-label="Play Video" />
        </div>
      )}
    </div>
  );
};

// Register the filters to apply the modifications at the appropriate stages
addFilter(hook, name, callback); // Adds custom attributes to the block
addFilter(editHook, name, editCallback); // Adds the inspector controls in the editor
addFilter(saveHook, name, saveCallback); // Modifies the save element
