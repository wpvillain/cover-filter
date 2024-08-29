// Import necessary functions and components from WordPress packages
import { addFilter } from '@wordpress/hooks'; // Allows adding filters to modify block behavior
import { createHigherOrderComponent } from '@wordpress/compose'; // Allows creating higher-order components (HOCs)
import { InspectorControls } from '@wordpress/block-editor'; // Provides control UI for block editing
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components'; // UI components for block settings
import { Fragment } from '@wordpress/element'; // A wrapper to group multiple elements without adding extra nodes to the DOM
import { cloneElement } from '@wordpress/element'; // Use cloneElement from WordPress

/**
 * @see {@link https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype}
 * Filter hook used to modify block settings during block registration.
 */
export const registerHook = 'blocks.registerBlockType';

/**
 * Name of the filter, used as a unique identifier.
 */
export const name = 'cafejp/cover'

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
  
	  // Modify the children elements within the block
	  const children = Array.isArray(props.children) ? props.children.filter(Boolean) : [];
	  const modifiedChildren = children.map((child, index) => {
		if (child && child.type === 'video') {
		  return cloneElement(child, {
			loop: loopVideo,
			autoPlay: autoplayVideo,
			poster: coverImage || child.props.poster,
			key: index,
		  });
		}
		return child;
	  });
  
	  // The play button should be conditionally rendered
	  const playButton = showPlayButton ? (
		<div className="wp-block-cover__play-button-overlay" style={{ position: 'absolute', zIndex: 10 }}>
		  <button className="wp-block-cover__play-button" aria-label="Play Video"></button>
		</div>
	  ) : null;
  
	  return (
		<Fragment>
		  {/* Render the original BlockEdit component */}
		  <BlockEdit {...props} />
  
		  {/* Render custom UI controls in the sidebar */}
		  <InspectorControls>
			<PanelBody title="Video Options" initialOpen={true}>
			  <ToggleControl
				label="Loop Video"
				checked={loopVideo}
				onChange={(value) => setAttributes({ loopVideo: value })}
			  />
			  <ToggleControl
				label="Autoplay Video"
				checked={autoplayVideo}
				onChange={(value) => setAttributes({ autoplayVideo: value })}
			  />
			  <ToggleControl
				label="Show Play Button"
				checked={showPlayButton}
				onChange={(value) => setAttributes({ showPlayButton: value })}
			  />
			  <TextControl
				label="Cover Image URL"
				value={coverImage}
				onChange={(value) => setAttributes({ coverImage: value })}
				help="This image will be used as the cover image for the video."
			  />
			</PanelBody>
		  </InspectorControls>
  
		  {/* Render the modified content inside the editor */}
		  <div {...props.blockProps}>
			{modifiedChildren}
			{playButton}
		  </div>
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
	const playButton = showPlayButton ? (
	  <div className="wp-block-cover__play-button-overlay" style={{ position: 'absolute', zIndex: 10 }}>
		<button className="wp-block-cover__play-button" aria-label="Play Video"></button>
	  </div>
	) : null;
  
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
