// Import necessary functions and components from WordPress packages
import { addFilter } from '@wordpress/hooks'; // Allows adding filters to modify block behavior
import { createHigherOrderComponent } from '@wordpress/compose'; // Allows creating higher-order components (HOCs)
import { InspectorControls } from '@wordpress/block-editor'; // Provides control UI for block editing
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components'; // UI components for block settings
import { Fragment } from '@wordpress/element'; // A wrapper to group multiple elements without adding extra nodes to the DOM
import { cloneElement } from '@wordpress/element'; // Use cloneElement from WordPress

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss'

/**
 * @see {@link https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype}
 * Filter hook used to modify block settings during block registration.
 */
export const registerHook = 'blocks.registerBlockType';

/**
 * Name of the filter, used as a unique identifier.
 */
export const name = 'cafejp/cover';

/**
 * Filter addAttributes function to modify the block's settings.
 *
 * @param {Object} settings Block settings.
 * @param {string} name Block name.
 * @returns Modified settings with new attributes added.
 */
export function addAttributes(settings, name) {
  if (name !== 'core/cover') return settings;

  return {
    ...settings, // Retain all existing settings https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
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
        default: false,
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
export const blockEditHook = 'editor.BlockEdit';

/**
 * Higher-order component (HOC) to modify the block's edit function.
 */
export const editCallback = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    const { attributes, setAttributes, name } = props;

    if (name !== 'core/cover') {
      return <BlockEdit {...props} />;
    }

    const { loopVideo, autoplayVideo, showPlayButton, coverImage } = attributes;

	let playButton = null;
    if (showPlayButton) {
      playButton = (
        <div className="wp-block-cover__play-button-overlay" style={{ position: 'absolute', zIndex: 10 }}>
          <button className="wp-block-cover__play-button" aria-label="Play Video"></button>
        </div>
      );
    }

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
		{playButton}
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
  if (blockType.name !== 'core/cover') return element;

  const { loopVideo, autoplayVideo, showPlayButton, coverImage } = attributes;

  // Ensure children elements are processed correctly, filtering out null/undefined elements
  const children = Array.isArray(element.props.children) ? element.props.children.filter(Boolean) : [];

  // Map over the children to modify any video elements with the specified attributes
  const modifiedChildren = children.map((child) => {
    if (child && child.type === 'video') {
      return cloneElement(child, {
        loop: loopVideo,
        autoPlay: autoplayVideo,
        poster: coverImage || child.props.poster,
      });
    }
    return child;
  });

  // Check if the play button should be added
  let playButton = null;
  if (showPlayButton) {
    playButton = (
      <div className="wp-block-cover__play-button-overlay" style={{ position: 'absolute', zIndex: 10 }}>
        <button className="wp-block-cover__play-button" aria-label="Play Video"></button>
      </div>
    );
  }

  return (
    <div {...element.props}>
      {modifiedChildren}
      {playButton}
    </div>
  );
};

// Register the filters to apply the modifications at the appropriate stages
addFilter(registerHook, name, addAttributes);
addFilter(blockEditHook, name, editCallback);
addFilter(saveHook, name, saveCallback);
